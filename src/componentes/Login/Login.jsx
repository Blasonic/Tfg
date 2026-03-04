// src/componentes/Login/Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [adminRedirecting, setAdminRedirecting] = useState(false);

  useEffect(() => {
    const msg = location.state?.resetInfo;
    if (msg) {
      setInfoMessage(msg);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // ✅ flujo común post-login (robusto)
  const postLoginFlow = async () => {
    // 1) guarda token para pantallas que lo lean de localStorage
    const token = await auth.currentUser.getIdToken();
    localStorage.setItem("token", token);

    // 2) bootstrap + perfil desde backend
    await bootstrapUser();
    const profile = await getUserProfile();

    // 3) normaliza lo que guardas (una convención)
    const merged = {
      uid: profile?.uid,
      email: profile?.email,
      displayName: profile?.displayName || "",
      user: profile?.user || "",
      avatarUrl: profile?.avatarUrl || auth.currentUser?.photoURL || "",
      isAdmin: profile?.isAdmin === true,
    };

    localStorage.setItem("user", JSON.stringify(merged));
    window.dispatchEvent(new Event("user-updated"));

    // 4) redirect
    if (merged.isAdmin) {
      setAdminRedirecting(true);
      setTimeout(() => navigate("/admin"), 300);
    } else {
      navigate("/");
    }

    setFormData({ email: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

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

  const handleGoogleLogin = async () => {
    setErrorMessage("");
    setInfoMessage("");

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

        {infoMessage && <div className="info-message">{infoMessage}</div>}

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

          <Link to="/OlvidarPassword" className="span">
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
          <button type="button" className="btn google" onClick={handleGoogleLogin}>
            <FaGoogle /> Google
          </button>

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
  }

  .info-message {
    background: #eef8ee;
    border: 1px solid #cbe8cb;
    color: #226b22;
    padding: 10px 12px;
    border-radius: 10px;
    font-size: 13px;
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
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .span {
    font-size: 14px;
    color: #2d79f3;
    font-weight: 500;
    cursor: pointer;
  }

  .button-submit {
    margin: 20px 0 10px 0;
    background-color: #ff751f;
    border: none;
    color: white;
    font-size: 15px;
    font-weight: 500;
    border-radius: 10px;
    height: 50px;
    width: 100%;
    cursor: pointer;
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
  }

  .btn:hover {
    border: 1px solid #ff751f;
  }

  .error-message {
    color: red;
    font-size: 0.9rem;
  }
`;

export default Login;