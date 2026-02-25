// src/componentes/VerPerfil/VerPerfil.jsx  (ajusta la ruta si tu archivo está en otra carpeta)
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Servicios backend users (Firestore via 3001)
import { getUserProfile, updateUserProfile } from "../../ServiciosBack/servicioFirebase";

// ✅ Opcional pero recomendado: fallback con photoURL de Firebase Auth
import { auth } from "../../firebase";

const avatarList = [
  "imagenes/avatares/avatar1.png",
  "imagenes/avatares/avatar2.png",
  "imagenes/avatares/avatar3.png",
  "imagenes/avatares/avatar4.png",
  "imagenes/avatares/avatar5.jpg",
  "imagenes/avatares/avatar6.jpg",
  "imagenes/avatares/avatar7.jpg",
  "imagenes/avatares/avatar8.webp",
  "imagenes/avatares/avatar9.jpg",
  "imagenes/avatares/avatar10.png",
];

const VerPerfil = () => {
  // UI keys: name/user/email/profilePicture
  const [userData, setUserData] = useState({
    name: "",
    user: "",
    email: "",
    profilePicture: "",
  });

  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const navigate = useNavigate();

  // ✅ Guarda perfil en localStorage SIN pisar campos + notifica al header
  const persistUser = (updated) => {
    const prev = JSON.parse(localStorage.getItem("user") || "{}");

    // unifica avatar con fallbacks (mantén una convención: avatarUrl recomendado)
    const avatar =
      updated?.profilePicture ??
      updated?.avatarUrl ??
      updated?.photoURL ??
      prev?.profilePicture ??
      prev?.avatarUrl ??
      prev?.photoURL ??
      auth?.currentUser?.photoURL ??
      null;

    const merged = {
      ...prev,
      ...updated,
      // normalizamos nombre
      displayName: updated?.displayName ?? prev?.displayName ?? userData.name ?? "",
      // guardamos avatar en ambas claves por compat con tu app
      avatarUrl: avatar,
      profilePicture: avatar,
    };

    localStorage.setItem("user", JSON.stringify(merged));

    // ✅ evento propio (storage no refresca en la misma pestaña)
    window.dispatchEvent(new Event("user-updated"));
  };

  // ✅ Cargar perfil al entrar
  useEffect(() => {
    (async () => {
      try {
        const data = await getUserProfile();

        const avatar =
          data?.profilePicture ??
          data?.avatarUrl ??
          data?.photoURL ??
          auth?.currentUser?.photoURL ??
          "";

        setUserData({
          name: data?.displayName || data?.name || "",
          user: data?.user || "",
          email: data?.email || "",
          profilePicture: avatar || "",
        });

        // (Opcional) mantener localStorage sincronizado al entrar al perfil
        persistUser({
          ...data,
          profilePicture: avatar || data?.profilePicture || "",
          avatarUrl: avatar || data?.avatarUrl || "",
        });
      } catch (err) {
        console.error("Error perfil:", err);
        toast.warning("Es necesario iniciar sesión para acceder al perfil.");
        setTimeout(() => navigate("/Login"), 1500);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((p) => ({ ...p, [name]: value }));
  };

  // ✅ Selección de avatar
  const handleAvatarSelect = async (avatarPath) => {
    try {
      const avatar = `/${avatarPath}`;

      const updatedUser = await updateUserProfile({
        displayName: userData.name,
        user: userData.user,
        profilePicture: avatar,
      });

      const next = {
        name: updatedUser?.displayName || userData.name || "",
        user: updatedUser?.user || userData.user || "",
        email: updatedUser?.email || userData.email || "",
        profilePicture: updatedUser?.profilePicture || avatar,
      };

      setUserData(next);
      persistUser({ ...updatedUser, profilePicture: next.profilePicture, avatarUrl: next.profilePicture });

      setShowAvatarOptions(false);
      toast.success("Avatar actualizado");
    } catch (error) {
      console.error("❌ Error avatar:", error);
      toast.error(error?.message || "Error al actualizar avatar");
    }
  };

  // ✅ Guardar cambios de texto (nombre / username)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUserProfile({
        displayName: userData.name,
        user: userData.user, // el backend puede devolver 400 si está ocupado
        profilePicture: userData.profilePicture,
      });

      const next = {
        name: updatedUser?.displayName || userData.name || "",
        user: updatedUser?.user || userData.user || "",
        email: updatedUser?.email || userData.email || "",
        profilePicture: updatedUser?.profilePicture || userData.profilePicture || "",
      };

      setUserData(next);
      persistUser({ ...updatedUser, profilePicture: next.profilePicture, avatarUrl: next.profilePicture });

      toast.success("Perfil actualizado");
    } catch (error) {
      console.error("❌ Error update perfil:", error);
      toast.error(error?.message || "Error al actualizar el perfil");
    }
  };

  const avatarSrc = userData.profilePicture || "/imagenes/avatares/avatar-en-blanco.webp";

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h2>Perfil de Usuario</h2>

        <div className="profile-picture-container">
          <img src={avatarSrc} alt="Avatar" className="profile-picture" />
          <button
            type="button"
            className="button-secondary"
            onClick={() => setShowAvatarOptions((v) => !v)}
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

        <button type="submit" className="button-submit">
          Guardar Cambios
        </button>

        <Link to="/" className="button-link">
          ← Volver al Home
        </Link>
      </form>

      <ToastContainer />
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
    background-color: #a7c4b2;
    border: none;
    color: white;
    font-size: 15px;
    border-radius: 10px;
    height: 40px;
    cursor: pointer;
  }

  .button-secondary {
    background-color: #a7c4b2;
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
    background-color: #a7c4b2;
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

export default VerPerfil;