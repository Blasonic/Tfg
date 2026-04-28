import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";

import { getUserProfile, updateUserProfile } from "../../ServiciosBack/servicioFirebase";
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
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [draft, setDraft] = useState({
    displayName: "",
    user: "",
    email: "",
    avatarUrl: "",
  });

  const savedRef = useRef({
    displayName: "",
    user: "",
    email: "",
    avatarUrl: "",
  });

  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const persistUser = (updated) => {
    const prev = JSON.parse(localStorage.getItem("user") || "{}");

    const merged = {
      ...prev,
      ...updated,
      displayName: updated?.displayName ?? prev?.displayName ?? "",
      user: updated?.user ?? prev?.user ?? "",
      email: updated?.email ?? prev?.email ?? "",
      avatarUrl:
        updated?.avatarUrl ??
        prev?.avatarUrl ??
        auth?.currentUser?.photoURL ??
        "",
    };

    localStorage.setItem("user", JSON.stringify(merged));
    window.dispatchEvent(new Event("user-updated"));
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserProfile();

        const initial = {
          displayName: data?.displayName || "",
          user: data?.user || "",
          email: data?.email || "",
          avatarUrl: data?.avatarUrl || auth?.currentUser?.photoURL || "",
        };

        savedRef.current = initial;
        setDraft(initial);
        setDirty(false);
      } catch (err) {
        console.error("Error perfil:", err);
        toast.warning(t("profile.toasts.loginRequired"));
        setTimeout(() => navigate("/Login"), 1200);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, t]);

  const markDirtyIfChanged = (nextDraft) => {
    const s = savedRef.current;
    const changed =
      nextDraft.displayName !== s.displayName ||
      nextDraft.user !== s.user ||
      nextDraft.avatarUrl !== s.avatarUrl;
    setDirty(changed);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDraft((prev) => {
      const next = { ...prev, [name]: value };
      markDirtyIfChanged(next);
      return next;
    });
  };

  const handleAvatarSelect = (avatarPath) => {
    const avatarUrl = `/${avatarPath}`;
    setDraft((prev) => {
      const next = { ...prev, avatarUrl };
      markDirtyIfChanged(next);
      return next;
    });
    setShowAvatarOptions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dirty) {
      toast.info(t("profile.toasts.noChanges"));
      return;
    }

    setSaving(true);
    try {
      const updated = await updateUserProfile({
        displayName: draft.displayName,
        user: draft.user,
        avatarUrl: draft.avatarUrl,
      });

      const committed = {
        ...draft,
        displayName: updated?.displayName ?? draft.displayName,
        user: updated?.user ?? draft.user,
        avatarUrl: updated?.avatarUrl ?? draft.avatarUrl,
      };

      savedRef.current = committed;
      setDraft(committed);
      setDirty(false);

      persistUser(committed);

      toast.success(t("profile.toasts.updated"));
    } catch (error) {
      console.error("❌ Error update perfil:", error);
      toast.error(error?.message || t("profile.toasts.updateError"));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(savedRef.current);
    setDirty(false);
    setShowAvatarOptions(false);
    toast.info(t("profile.toasts.discarded"));
  };

  const avatarSrc = draft.avatarUrl || "/imagenes/avatares/avatar-en-blanco.webp";

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h2>{t("profile.title")}</h2>

        <div className="profile-picture-container">
          <img
            src={avatarSrc}
            alt={t("profile.avatarAlt")}
            className="profile-picture"
            onError={(e) => {
              e.currentTarget.src = "/imagenes/avatares/avatar-en-blanco.webp";
            }}
          />

          <button
            type="button"
            className="button-secondary"
            onClick={() => setShowAvatarOptions((v) => !v)}
            disabled={saving}
          >
            {t("profile.chooseAvatar")}
          </button>

          {dirty && <div className="dirty-badge">{t("profile.unsavedChanges")}</div>}
        </div>

        {showAvatarOptions && (
          <div className="avatar-options">
            {avatarList.map((avatar) => (
              <img
                key={avatar}
                src={`/${avatar}`}
                alt={t("profile.avatarAlt")}
                className="avatar-option"
                onClick={() => handleAvatarSelect(avatar)}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ))}
          </div>
        )}

        <div className="inputForm">
          <label>{t("profile.labels.name")}</label>
          <input
            type="text"
            name="displayName"
            value={draft.displayName}
            onChange={handleChange}
            disabled={saving}
          />
        </div>

        <div className="inputForm">
          <label>{t("profile.labels.username")}</label>
          <input
            type="text"
            name="user"
            value={draft.user}
            onChange={handleChange}
            disabled={saving}
          />
        </div>

        <div className="inputForm">
          <label>{t("profile.labels.email")}</label>
          <input type="email" value={draft.email} disabled />
        </div>

        <div className="buttons-row">
          <button type="submit" className="button-submit" disabled={saving || !dirty}>
            {saving ? t("profile.buttons.saving") : t("profile.buttons.save")}
          </button>

          <button
            type="button"
            className="button-cancel"
            onClick={handleCancel}
            disabled={saving || !dirty}
          >
            {t("profile.buttons.cancel")}
          </button>
        </div>

        <Link to="/" className="button-link">
          {t("profile.buttons.backHome")}
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

  .dirty-badge {
    font-size: 12px;
    color: #7a4b00;
    background: #fff3d6;
    border: 1px solid #ffd48a;
    padding: 6px 10px;
    border-radius: 999px;
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
    transform: scale(1.08);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
  }

  .buttons-row {
    display: flex;
    gap: 10px;
  }

  .button-submit {
    flex: 1;
    background-color: #ff751f;
    border: none;
    color: white;
    font-size: 15px;
    border-radius: 10px;
    height: 40px;
    cursor: pointer;
  }

  .button-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .button-secondary {
    background-color: #ff751f;
    border: none;
    color: white;
    font-size: 13px;
    border-radius: 10px;
    height: 30px;
    cursor: pointer;
    padding: 0 10px;
  }

  .button-cancel {
    flex: 1;
    background-color: #eee;
    border: 1px solid #ddd;
    color: #333;
    font-size: 15px;
    border-radius: 10px;
    height: 40px;
    cursor: pointer;
  }

  .button-cancel:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .button-link {
    display: inline-block;
    text-align: center;
    text-decoration: none;
    margin-top: 10px;
    background-color: #ff751f;
    color: white;
    border-radius: 10px;
    padding: 8px 12px;
    font-size: 14px;
  }

  .button-link:hover,
  .button-submit:hover,
  .button-secondary:hover {
    background-color: #c54f06;
  }

  .button-cancel:hover {
    background-color: #e0e0e0;
  }
`;

export default VerPerfil;