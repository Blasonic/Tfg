import React, { useState } from 'react';
import './Registro.css';
import { Link, useNavigate } from 'react-router-dom'; 
import { registerUser } from '../../Serviciosback/servicio';

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return; 
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    try {
      await registerUser(userData);
      navigate('/Login'); 
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  };
  return (
    <div className="login-container">
      <Link to="/Login">
        <button className="login">Iniciar Sesión</button>
      </Link>
      <form className="login-formulario" onSubmit={handleRegister}>
        <h2>Crear Cuenta</h2>
        <div className="formulario-grupos">
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            placeholder="Ingresa tu nombre"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formulario-grupos">
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            placeholder="Ingresa tu correo"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formulario-grupos">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            placeholder="Ingresa tu contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formulario-grupos">
          <label htmlFor="confirmPassword">Repita la Contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Repita tu contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="login-boton">Registrarse</button>
      </form>
    </div>
  );
}

export default Registro;
