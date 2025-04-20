import React, { useState } from 'react';
import styled from 'styled-components';

const FormularioAnadir = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    hora_inicio: '',
    hora_fin: '',
    tipo: 'evento',
    imagen: '',
    provincia: 'Madrid',
    direccion: '',
    imagenArchivo: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagenArchivo') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({ ...formData, imagen: reader.result, imagenArchivo: file });
        };
        reader.readAsDataURL(file);
      } else {
        setFormData({ ...formData, imagen: '', imagenArchivo: null });
      }
    } else if (name === 'imagen') {
      setFormData({ ...formData, imagen: value, imagenArchivo: null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleClose = () => {
    if (onSubmit) onSubmit(null);
  };

  return (
    <StyledWrapper onClick={handleClose}>
      <div className="modal-inner" onClick={(e) => e.stopPropagation()}>
        <form
          className="formulario-evento"
          onSubmit={(e) => {
            e.preventDefault();
            if (onSubmit) onSubmit(formData);
          }}
        >
          <button className="cerrar-btn izquierda" type="button" onClick={handleClose}>✖</button>
          <h2>Solicitar Evento</h2>

          <input type="text" name="titulo" placeholder="Título" value={formData.titulo} onChange={handleChange} required />

          <textarea className="descripcion" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} required />

          <label>Fecha de inicio</label>
          <input type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChange} required />

          <label>Fecha de fin</label>
          <input type="date" name="fecha_fin" value={formData.fecha_fin} onChange={handleChange} required />

          <label>Hora de inicio</label>
          <input type="time" name="hora_inicio" value={formData.hora_inicio} onChange={handleChange} required />

          <label>Hora de fin</label>
          <input type="time" name="hora_fin" value={formData.hora_fin} onChange={handleChange} required />

          <select name="tipo" value={formData.tipo} onChange={handleChange} required>
            <option value="evento">Evento</option>
            <option value="local">Local</option>
            <option value="patronal">Patronal</option>
          </select>

          <input type="text" name="provincia" placeholder="Provincia" value={formData.provincia} onChange={handleChange} />
          <input type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleChange} />

          <div className="imagen-inputs">
            <input
              type="text"
              name="imagen"
              placeholder="URL de imagen"
              value={formData.imagenArchivo ? '' : formData.imagen}
              onChange={handleChange}
              disabled={formData.imagenArchivo}
            />
            <label className="file-btn">
              Seleccionar archivo
              <input
                type="file"
                name="imagenArchivo"
                accept="image/*"
                onChange={handleChange}
                disabled={formData.imagen !== ''}
              />
            </label>
          </div>

          <button type="submit" className='btn-enviar'>Enviar solicitud</button>
        </form>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  .modal-inner {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    position: relative;
  }

  .formulario-evento {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background-color: #ffffff;
    padding: 24px 20px;
    width: 100%;
    max-width: 420px;
    border-radius: 18px;
    max-height: 85vh;
    overflow-y: auto;
  }

  .cerrar-btn {
    position: absolute;
    right: 15px;
    top: 24px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    margin: 0;
    line-height: 1;
  }

  .formulario-evento h2 {
    margin: 0;
    font-size: 20px;
    font-weight: bold;
    display: inline-block;
  }

  label {
    font-size: 12px;
  }

  input,
  textarea,
  select {
    height: 42px;
    padding: 10px;
    box-sizing: border-box;
    width: 100%;
  }

  textarea {
    resize: vertical;
    min-height: 42px;
  }

  .imagen-inputs {
    display: flex;
    gap: 8px;
  }

  .imagen-inputs input {
    flex: 1;
  }

  .btn-enviar, .file-btn {
    background-color: #A7C4B2;
    color: white;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.3s ease;
    display: inline-block;
    position: relative;
    border: none;
  }

  .btn-enviar:hover, .file-btn:hover {
    background-color: #8cab99;
  }

  .file-btn input[type=\"file\"] {
    position: absolute;
    opacity: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
`;


export default FormularioAnadir;
