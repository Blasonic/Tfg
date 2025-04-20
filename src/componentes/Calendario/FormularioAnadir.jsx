import React, { useState } from 'react';
import styled from 'styled-components';

const FormularioAnadir = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha: '',
    hora: '',
    tipo: 'evento',
    imagen: '',
    provincia: 'Madrid',
    direccion: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <StyledWrapper>
      <form className="formulario-evento" onSubmit={handleSubmit}>
        <h2>Solicitar Evento</h2>

        <input
          type="text"
          name="titulo"
          placeholder="Título"
          value={formData.titulo}
          onChange={handleChange}
          required
        />

        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="hora"
          value={formData.hora}
          onChange={handleChange}
          required
        />

        <select
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          required
        >
          <option value="evento">Evento</option>
          <option value="local">Local</option>
          <option value="patronal">Patronal</option>
        </select>

        <input
          type="text"
          name="provincia"
          placeholder="Provincia"
          value={formData.provincia}
          onChange={handleChange}
        />

        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={formData.direccion}
          onChange={handleChange}
        />

        <input
          type="text"
          name="imagen"
          placeholder="URL de imagen"
          value={formData.imagen}
          onChange={handleChange}
        />

        <button type="submit">Enviar solicitud</button>
      </form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .formulario-evento {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #ffffff;
    padding: 30px;
    width: 450px;
    border-radius: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  }

  .formulario-evento h2 {
    text-align: center;
    color: #333;
  }

  .formulario-evento input,
  .formulario-evento textarea,
  .formulario-evento select {
    border: 1.5px solid #ecedec;
    border-radius: 10px;
    height: 45px;
    padding: 0 10px;
    font-size: 14px;
    background-color: transparent;
    outline: none;
  }

  .formulario-evento textarea {
    height: 80px;
    padding: 10px;
    resize: none;
  }

  .formulario-evento input:focus,
  .formulario-evento textarea:focus,
  .formulario-evento select:focus {
    border-color: #2d79f3;
  }

  .formulario-evento button {
    margin-top: 20px;
    background-color: #A7C4B2;
    border: none;
    color: white;
    font-size: 15px;
    font-weight: 500;
    border-radius: 10px;
    height: 50px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .formulario-evento button:hover {
    background-color: #8cab99;
  }
`;

export default FormularioAnadir;