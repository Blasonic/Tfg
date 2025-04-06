import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../../ServiciosBack/servicio';
import styled from 'styled-components';

const VerPerfil = () => {
  const [userData, setUserData] = useState({
    name: '',
    user: '',
    email: '',
    profilePicture: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    getUserProfile()
      .then((data) => {
        setUserData(data);
        setPreview(data.profilePicture || 'default-profile.png');
      })
      .catch(() => console.error('Error al cargar el perfil'));
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, user: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = { user: userData.user };
    if (selectedFile) updatedData.profilePicture = preview;

    try {
      const updatedUser = await updateUserProfile(updatedData);
      setUserData(updatedUser);
    } catch {
      console.error('Error al actualizar el perfil');
    }
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h2>Perfil de Usuario</h2>

        <div className="profile-picture-container">
          <img src={preview} alt="Perfil" className="profile-picture" />
          <label className="button-small">
            Seleccionar Archivo
            <input type="file" accept="image/*" onChange={handleFileChange} hidden />
          </label>
        </div>

        <div className="inputForm">
          <label>Nombre Completo</label>
          <input type="text" value={userData.name} disabled />
        </div>

        <div className="inputForm">
          <label>Nombre de Usuario</label>
          <input type="text" value={userData.user} onChange={handleChange} required />
        </div>

        <div className="inputForm">
          <label>Correo Electrónico</label>
          <input type="email" value={userData.email} disabled />
        </div>

        <button type="submit" className="button-submit">Guardar Cambios</button>

        {/* 🔹 Enlace en lugar de botón */}
        <Link to="/" className="link-button">Volver al Home</Link>
      </form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;

  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #ffffff;
    padding: 20px;
    width: 350px;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .inputForm {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .profile-picture-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .profile-picture {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }

  .button-submit {
    background-color: #A7C4B2;
    border: none;
    color: white;
    font-size: 15px;
    border-radius: 10px;
    height: 40px;
    cursor: pointer;
  }

  .button-small {
    background-color: #A7C4B2;
    border: none;
    color: white;
    font-size: 13px;
    border-radius: 8px;
    height: 35px;
    cursor: pointer;
    padding: 5px 10px;
    text-align: center;
    display: inline-block;
  }

  .link-button {
    background-color: #A7C4B2;
    color: white;
    font-size: 13px;
    text-align: center;
    border-radius: 8px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    padding: 5px 10px;
    margin-top: 5px;
  }

  .button-small:hover,
  .button-submit:hover,
  .link-button:hover {
    background-color: #8fae99;
  }
`;

export default VerPerfil;
