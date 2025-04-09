import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../../ServiciosBack/servicio';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const avatarList = [
  'imagenes/avatares/avatar1.png',
  'imagenes/avatares/avatar2.png',
  'imagenes/avatares/avatar3.png',
  'imagenes/avatares/avatar4.png',
  'imagenes/avatares/avatar5.jpg',
  'imagenes/avatares/avatar6.jpg',
  'imagenes/avatares/avatar7.jpg',
  'imagenes/avatares/avatar8.webp',
  'imagenes/avatares/avatar9.jpg',
  'imagenes/avatares/avatar10.png',
];

const PerfilUnificado = () => {
  const [userData, setUserData] = useState({ name: '', user: '', email: '', profilePicture: '' });
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);

  useEffect(() => {
    getUserProfile()
      .then((data) => {
        setUserData(data);
      })
      .catch((err) => {
        console.error('Error al obtener el perfil:', err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleAvatarSelect = async (avatarPath) => {
    try {
      const updatedData = {
        name: userData.name,
        user: userData.user,
        profilePicture: `/${avatarPath}`,
      };

      const updatedUser = await updateUserProfile(updatedData);
      setUserData(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setShowAvatarOptions(false);
    } catch (error) {
      console.error('❌ Error al actualizar el perfil con el avatar:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUserProfile({
        name: userData.name,
        user: userData.user,
        profilePicture: userData.profilePicture,
      });
      setUserData(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch {
      console.error('Error al actualizar el perfil');
    }
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h2>Perfil de Usuario</h2>

        <div className="profile-picture-container">
          <img
            src={userData.profilePicture || '/imagenes/avatares/avatar1.jpg'}
            alt="Avatar"
            className="profile-picture"
          />
          <button
            type="button"
            className="button-secondary"
            onClick={() => setShowAvatarOptions(!showAvatarOptions)}
          >
            Elegir Avatar
          </button>
        </div>

        {showAvatarOptions && (
          <div className="avatar-options">
            {avatarList.map((avatar) => (
              <img
                key={avatar}
                src={`/${avatar}`}
                alt="Avatar"
                className="avatar-option"
                onClick={() => handleAvatarSelect(avatar)}
              />
            ))}
          </div>
        )}

        <div className="inputForm">
          <label>Nombre</label>
          <input type="text" name="name" value={userData.name} onChange={handleChange} />
        </div>

        <div className="inputForm">
          <label>Nombre de Usuario</label>
          <input type="text" name="user" value={userData.user} onChange={handleChange} />
        </div>

        <div className="inputForm">
          <label>Correo Electrónico</label>
          <input type="email" value={userData.email} disabled />
        </div>

        <button type="submit" className="button-submit">Guardar Cambios</button>
        <Link to="/" className="button-link">← Volver al Home</Link>
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

  .avatar-options {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-bottom: 10px;
  }

  .avatar-option {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    object-fit: cover;
    transition: transform 0.2s ease;
  }

  .avatar-option:hover {
    transform: scale(1.1);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
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

  .button-secondary {
    background-color: #A7C4B2;
    border: none;
    color: white;
    font-size: 13px;
    border-radius: 10px;
    height: 30px;
    cursor: pointer;
    padding: 0 10px;
  }

  .button-link {
    display: inline-block;
    text-align: center;
    text-decoration: none;
    margin-top: 10px;
    background-color: #A7C4B2;
    color: white;
    border-radius: 10px;
    padding: 8px 12px;
    font-size: 14px;
  }

  .button-link:hover,
  .button-submit:hover,
  .button-secondary:hover {
    background-color: #8fae99;
  }
`;

export default PerfilUnificado;
