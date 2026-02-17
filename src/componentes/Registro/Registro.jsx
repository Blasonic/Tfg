import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// ✅ Firebase Auth
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";

// ✅ llamadas al backend con token Firebase
import { bootstrapUser, updateUserProfile, getUserProfile } from "../../ServiciosBack/servicioFirebase";



const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    user: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "", user: "" });
  const [passwordStatus, setPasswordStatus] = useState({});
  const [emailValid, setEmailValid] = useState(null);

  const passwordRules = {
    length: "Al menos 8 caracteres",
    uppercase: "Al menos una letra mayúscula",
    number: "Al menos un número",
    special: "Al menos un carácter especial",
  };

  const getPasswordStatus = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));

    if (id === "password") setPasswordStatus(getPasswordStatus(value));

    if (id === "email") {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setEmailValid(isValidEmail);
    }

    if (id === "email" || id === "user") {
      setFieldErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));
    }

    setErrorMessage("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors({ email: "", user: "" });

    if (!emailValid) {
      setErrorMessage("El formato del correo es inválido");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    const status = getPasswordStatus(formData.password);
    const allValid = Object.values(status).every(Boolean);
    if (!allValid) {
      setErrorMessage("La contraseña no cumple con todos los requisitos");
      return;
    }

    try {
      // ✅ 1) Crear usuario en Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      // ✅ 2) (Opcional) Guardar displayName en Auth
      // Nota: tu "name" lo usamos como displayName
      await updateProfile(cred.user, { displayName: formData.name });

      // ✅ 3) Backend: crear estructura users/{uid} + subdocs
      await bootstrapUser();

      // ✅ 4) Backend: guardar username + foto default + displayName
    await updateUserProfile({
  user: formData.user,
  displayName: formData.name,
  profilePicture: "/imagenes/avatares/avatar-en-blanco.webp",
});
const profile = await getUserProfile();

// ✅ 6) Guardarlo en localStorage para que el header ya tenga avatar
localStorage.setItem("user", JSON.stringify(profile));
window.dispatchEvent(new Event("storage"));

// ✅ 7) Redirigir directamente al home (mejor UX)
navigate('/');

      // ✅ 5) Redirigir
      navigate('/Login');
    } catch (error) {
      const code = error?.code || "";
      const message = error?.message || "Error al registrar la cuenta";

      // Errores típicos Firebase
      if (code === "auth/email-already-in-use") {
        setFieldErrors({ email: "El correo ya está registrado", user: "" });
        return;
      }
      if (code === "auth/invalid-email") {
        setFieldErrors({ email: "Correo inválido", user: "" });
        return;
      }
      if (code === "auth/weak-password") {
        setErrorMessage("Contraseña débil (mínimo 6). Mantén tus requisitos de 8+.");
        return;
      }

      // Si tu backend devuelve error por username repetido (cuando lo implementemos)
      if (message.toLowerCase().includes("usuario")) {
        setFieldErrors({ email: "", user: message });
        return;
      }

      setErrorMessage(message);
    }
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleRegister}>
        <h2>Crear Cuenta</h2>

        <div className="flex-column"><label>Nombre</label></div>
        <div className="inputForm">
          <input type="text" id="name" placeholder="Ingresa tu nombre" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="flex-column"><label>Nombre de Usuario</label></div>
        <div className="inputForm">
          <input type="text" id="user" placeholder="Ingresa un nombre de usuario" value={formData.user} onChange={handleChange} required />
        </div>
        {fieldErrors.user && <p className="error-message">{fieldErrors.user}</p>}

        <div className="flex-column"><label>Correo Electrónico</label></div>
        <div className="inputForm">
          <input type="email" id="email" placeholder="Ingresa tu correo" value={formData.email} onChange={handleChange} required />
        </div>
        {emailValid !== null && (
          <p className={emailValid ? "valid-message" : "invalid-message"}>
            {emailValid ? "✔ Formato de correo válido" : "✘ Correo inválido"}
          </p>
        )}
        {fieldErrors.email && <p className="error-message">{fieldErrors.email}</p>}

        <div className="flex-column"><label>Contraseña</label></div>
        <div className="inputForm">
          <input type="password" id="password" placeholder="Ingresa tu contraseña" value={formData.password} onChange={handleChange} required />
        </div>

        {formData.password && (
          <div className="password-status-box">
            <p>La contraseña debe cumplir con:</p>
            <ul className="password-status-list">
              {Object.entries(passwordRules).map(([key, label]) => (
                <li key={key} className={passwordStatus[key] ? "valid" : "invalid"}>
                  {passwordStatus[key] ? "✔" : "✘"} {label}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex-column"><label>Confirmar Contraseña</label></div>
        <div className="inputForm">
          <input type="password" id="confirmPassword" placeholder="Repita tu contraseña" value={formData.confirmPassword} onChange={handleChange} required />
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" className="button-submit">Registrarse</button>
        <p className="p">¿Ya tienes cuenta? <Link to="/Login" className="span">Inicia sesión</Link></p>
      </form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .form {
    display: flex;
    flex-direction: column;
    gap: 2px;
    background-color: #ffffff;
    padding: 25px;
    width: 350px;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .flex-column > label {
    color: #151717;
    font-weight: 600;
  }

  .inputForm {
    border: 1.5px solid #ecedec;
    border-radius: 10px;
    height: 45px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    transition: 0.2s ease-in-out;
  }

  .inputForm input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
  }

  .inputForm input::placeholder {
    color: #888;
    opacity: 1;
  }

  .inputForm:focus-within {
    border: 1.5px solid #2d79f3;
  }

  .button-submit {
    margin: 20px 0 10px 0;
    background-color: #A7C4B2;
    border: none;
    color: white;
    font-size: 15px;
    font-weight: 500;
    border-radius: 10px;
    height: 45px;
    width: 100%;
    cursor: pointer;
  }

  .p {
    text-align: center;
    color: black;
    font-size: 14px;
    margin: 5px 0;
  }

  .span {
    font-size: 14px;
    color: #2d79f3;
    font-weight: 500;
    cursor: pointer;
  }

  .error-message {
    color: red;
    font-size: 13px;
    margin: 4px 0 0 5px;
  }

  .valid-message {
    color: green;
    font-size: 13px;
    margin: 4px 0 0 5px;
  }

  .invalid-message {
    color: red;
    font-size: 13px;
    margin: 4px 0 0 5px;
  }

  .password-status-box {
    background-color: #f1f1f1;
    border-radius: 8px;
    padding: 10px;
    margin: 8px 0 10px 0;
    font-size: 14px;
  }

  .password-status-list {
    list-style: none;
    padding-left: 0;
    margin: 5px 0 0 0;
  }

  .password-status-list li {
    margin-bottom: 4px;
  }

  .valid {
    color: green;
    font-weight: 500;
  }

  .invalid {
    color: red;
    font-weight: 500;
  }
`;

export default Registro;
