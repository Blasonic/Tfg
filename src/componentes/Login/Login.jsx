import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaApple } from 'react-icons/fa';
import styled from 'styled-components';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [adminRedirecting, setAdminRedirecting] = useState(false); // NUEVO

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar token y usuario
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // 🔥 Redirigir según el role
        if (data.user.role === 'admin') {
          setAdminRedirecting(true); // mostramos mensaje de carga
          setTimeout(() => {
            navigate("/admin");
          }, 3000); // 3 segundos
        } else {
          navigate("/");
        }

        setFormData({ email: "", password: "" });
        window.dispatchEvent(new Event("storage"));
      } else {
        setErrorMessage(data.message || "Correo o contraseña incorrectos");
      }
    } catch (error) {
      console.error("❌ Error en login:", error);
      setErrorMessage("Error al intentar iniciar sesión");
    }
  };

  // 💬 Mostrar carga si es admin
  if (adminRedirecting) {
    return (
      <StyledWrapper>
        <h2 style={{ textAlign: 'center' }}>Cargando panel de administración...</h2>
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
          <Link to="/PerdidaContraseña" className="span">¿Olvidaste tu contraseña?</Link>
        </div>

        <button type="submit" className="button-submit">Ingresar</button>

        <p className="p">¿No tienes cuenta? <Link to="/Registro" className="span">Regístrate</Link></p>
        <p className="p line">O ingresa con</p>

        <div className="flex-row">
          <button type="button" className="btn google">
            <FaGoogle /> Google
          </button>
          <button type="button" className="btn apple">
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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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
    background-color: #A7C4B2;
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
    border: 1px solid #A7C4B2;
  }

  .error-message {
    color: red;
    font-size: 0.9rem;
    margin-top: -5px;
    margin-bottom: 10px;
  }

  /* ===== MÓVILES (≤480px) ===== */
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

  /* ===== TABLETS (481px – 1024px) ===== */
  @media (min-width: 481px) and (max-width: 1024px) {
    .form {
      padding: 25px;
      max-width: 600px;
      border-radius: 18px;
    }

    .search-container input {
      font-size: 1rem;
    }

    .btn {
      font-size: 15px;
    }

    .button-submit {
      font-size: 16px;
    }
  }

  /* ===== PANTALLAS GRANDES (≥1440px) ===== */
@media (min-width: 1440px) {
  .form {
    max-width: 900px;         /* Mucho más ancho */
    min-height: 600px;        /* Más alto */
    padding: 60px 80px;       /* Más espacio interno */
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
