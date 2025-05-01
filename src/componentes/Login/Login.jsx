import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaApple } from 'react-icons/fa';
import styled from 'styled-components';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/Login", {
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
          navigate("/admin");
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
  height: 100vh;

  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #ffffff;
    padding: 30px;
    width: 450px;
    border-radius: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  ::placeholder {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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

  .inputForm input::placeholder {
    color: #888;
    opacity: 1;
  }

  .input {
    margin-left: 10px;
    border-radius: 10px;
    border: none;
    width: 100%;
    height: 100%;
  }

  .input:focus {
    outline: none;
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
    background-color:#A7C4B2;
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
`;

export default Login;