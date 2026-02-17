import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaApple } from "react-icons/fa";
import styled from "styled-components";
import "./Login.css";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "../../firebase";
import { bootstrapUser, getUserProfile } from "../../ServiciosBack/servicioFirebase";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [adminRedirecting, setAdminRedirecting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // ✅ flujo común post-login
  const postLoginFlow = async () => {
    await bootstrapUser();
    const profile = await getUserProfile();

    localStorage.setItem("user", JSON.stringify(profile));
    window.dispatchEvent(new Event("storage"));

    if (profile.role === "admin") {
      setAdminRedirecting(true);
      setTimeout(() => navigate("/admin"), 1500);
    } else {
      navigate("/");
    }

    setFormData({ email: "", password: "" });
  };

  // ✅ Login email/password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      await postLoginFlow();
    } catch (error) {
      const code = error?.code || "";

      if (
        code === "auth/invalid-credential" ||
        code === "auth/wrong-password" ||
        code === "auth/user-not-found"
      ) {
        setErrorMessage("Correo o contraseña incorrectos");
      } else if (code === "auth/too-many-requests") {
        setErrorMessage("Demasiados intentos. Espera un momento y prueba otra vez.");
      } else {
        console.error("❌ Error en login:", error);
        setErrorMessage(error?.message || "Error al intentar iniciar sesión");
      }
    }
  };

  // ✅ Login Google
  const handleGoogleLogin = async () => {
    setErrorMessage("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      await postLoginFlow();
    } catch (error) {
      console.error("❌ Error Google login:", error);
      setErrorMessage("Error al iniciar sesión con Google");
    }
  };

  if (adminRedirecting) {
    return (
      <StyledWrapper>
        <h2 style={{ textAlign: "center" }}>Cargando panel de administración...</h2>
      </StyledWrapper>
    );
  }

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>

        <div className="flex-column">
          <label>Email</label>
        </div>
        <div className="inputForm">
          <input
            type="email"
            id="email"
            placeholder="Ingresa tu correo"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex-column">
          <label>Contraseña</label>
        </div>
        <div className="inputForm">
          <input
            type="password"
            id="password"
            placeholder="Ingresa tu contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="flex-row">
          <div>
            <input type="checkbox" />
            <label>Recordarme</label>
          </div>
          <Link to="/PerdidaContraseña" className="span">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button type="submit" className="button-submit">
          Ingresar
        </button>

        <p className="p">
          ¿No tienes cuenta?{" "}
          <Link to="/Registro" className="span">
            Regístrate
          </Link>
        </p>

        <p className="p line">O ingresa con</p>

        <div className="flex-row">
          {/* ✅ Google (activo) */}
          <button type="button" className="btn google" onClick={handleGoogleLogin}>
            <FaGoogle /> Google
          </button>

          {/* Apple lo dejamos para luego */}
          <button type="button" className="btn apple" disabled>
            <FaApple /> Apple
          </button>
        </div>
      </form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;

  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #ffffff;
    padding: 30px;
    width: 100%;
    max-width: 450px;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
      Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  ::placeholder {
    font-family: inherit;
  }

  .form button {
    align-self: flex-end;
  }

  .flex-column > label {
    color: #151717;
    font-weight: 600;
  }

  .inputForm {
    border: 1.5px solid #ecedec;
    border-radius: 10px;
    height: 50px;
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

  .inputForm:focus-within {
    border: 1.5px solid #2d79f3;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .flex-row > div {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .flex-row > div > label {
    font-size: 14px;
    color: black;
    font-weight: 400;
  }

  .span {
    font-size: 14px;
    margin-left: 5px;
    color: #2d79f3;
    font-weight: 500;
    cursor: pointer;
  }

  .button-submit {
    margin: 20px 0 10px 0;
    background-color: #a7c4b2;
    border: none;
    color: white;
    font-size: 15px;
    font-weight: 500;
    border-radius: 10px;
    height: 50px;
    width: 100%;
    cursor: pointer;
  }

  .p {
    text-align: center;
    color: black;
    font-size: 14px;
    margin: 5px 0;
  }

  .line {
    margin-top: 10px;
  }

  .btn {
    margin-top: 10px;
    width: 100%;
    height: 50px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    gap: 10px;
    border: 1px solid #ededef;
    background-color: white;
    cursor: pointer;
    transition: 0.2s ease-in-out;
  }

  .btn:hover {
    border: 1px solid #a7c4b2;
  }

  .error-message {
    color: red;
    font-size: 0.9rem;
    margin-top: -5px;
    margin-bottom: 10px;
  }

  @media (max-width: 480px) {
    .form {
      padding: 20px;
      border-radius: 12px;
    }

    .btn {
      font-size: 14px;
      padding: 0 10px;
    }

    .span {
      display: block;
      margin-top: 5px;
      margin-left: 0;
    }

    .flex-row {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  @media (min-width: 481px) and (max-width: 1024px) {
    .form {
      padding: 25px;
      max-width: 600px;
      border-radius: 18px;
    }

    .btn {
      font-size: 15px;
    }

    .button-submit {
      font-size: 16px;
    }
  }

  @media (min-width: 1440px) {
    .form {
      max-width: 900px;
      min-height: 600px;
      padding: 60px 80px;
      border-radius: 30px;
      display: flex;
      justify-content: center;
      gap: 20px;
    }

    .inputForm {
      height: 60px;
      font-size: 18px;
    }

    .inputForm input {
      font-size: 18px;
    }

    .button-submit {
      font-size: 20px;
      height: 65px;
    }

    .btn {
      height: 65px;
      font-size: 18px;
    }

    .flex-column > label {
      font-size: 18px;
    }

    .p {
      font-size: 16px;
    }

    .span {
      font-size: 16px;
    }
  }
`;

export default Login;
