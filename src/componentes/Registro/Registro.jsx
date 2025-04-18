import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { registerUser } from '../../ServiciosBack/servicio';

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
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    user: ""
  });
  const [passwordErrors, setPasswordErrors] = useState([]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));

    if (id === "email" || id === "user") {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [id]: ""
      }));
    }


    setErrorMessage("");
  };

  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push("Debe tener al menos 8 caracteres");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Debe tener al menos una letra mayúscula");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Debe tener al menos un número");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Debe tener al menos un carácter especial");
    }

    return errors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors({ email: "", user: "" });

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (passwordValidation.length > 0) {
      setPasswordErrors(passwordValidation);
      return;
    }

    setPasswordErrors([]); 

    const userData = {
      name: formData.name,
      user: formData.user,
      email: formData.email,
      password: formData.password,
    };

    try {
      await registerUser(userData);
      navigate('/Login');
    } catch (error) {
      const message = error.message || "Error al registrar la cuenta";

      const newFieldErrors = { email: "", user: "" };

      if (message.toLowerCase().includes("correo")) {
        newFieldErrors.email = message;
      }

      if (message.toLowerCase().includes("usuario")) {
        newFieldErrors.user = message;
      }

      if (!newFieldErrors.email && !newFieldErrors.user) {
        setErrorMessage(message);
      }

      setFieldErrors(newFieldErrors);
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
        {fieldErrors.email && <p className="error-message">{fieldErrors.email}</p>}

        <div className="flex-column"><label>Contraseña</label></div>
        <div className="inputForm">
          <input type="password" id="password" placeholder="Ingresa tu contraseña" value={formData.password} onChange={handleChange} required />
        </div>

        {passwordErrors.length > 0 && (
          <div className="password-error-box">
            <p className="error-message">La contraseña no es válida:</p>
            <ul className="password-error-list">
              {passwordErrors.map((err, idx) => (
                <li key={idx} className="error-message">{err}</li>
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

  .password-error-box {
    background-color: #ffe5e5;
    border: 1px solid red;
    border-radius: 8px;
    padding: 10px;
    margin: 8px 0 10px 0;
  }

  .password-error-list {
    padding-left: 20px;
    margin: 0;
  }
`;

export default Registro;
