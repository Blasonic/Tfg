import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../firebase";

import {
  bootstrapUser,
  updateUserProfile,
  getUserProfile,
} from "../../ServiciosBack/servicioFirebase";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const Registro = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    user: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "", user: "" });
  const [emailValid, setEmailValid] = useState(null);
  const [infoMessage, setInfoMessage] = useState("");

  const passwordRules = {
    length: t("register.passwordRules.length"),
    uppercase: t("register.passwordRules.uppercase"),
    number: t("register.passwordRules.number"),
    special: t("register.passwordRules.special"),
  };

  const getPasswordStatus = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const passwordStatus = useMemo(
    () => getPasswordStatus(formData.password),
    [formData.password]
  );

  const allPasswordValid = useMemo(() => {
    if (!formData.password) return false;
    return Object.values(getPasswordStatus(formData.password)).every(Boolean);
  }, [formData.password]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));

    if (id === "email") {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setEmailValid(isValidEmail);
    }

    if (id === "email" || id === "user") {
      setFieldErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));
    }

    setErrorMessage("");
    setInfoMessage("");
  };

  const sendWelcomeEmail = async (firebaseUser, name) => {
    const token = await firebaseUser.getIdToken();

    const res = await fetch(`${API_URL}/api/email/bienvenida`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.warn("⚠️ Welcome email no enviado:", data?.message || res.status);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");
    setFieldErrors({ email: "", user: "" });

    if (!emailValid) {
      setErrorMessage(t("register.errors.invalidEmailFormat"));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage(t("register.errors.passwordsDoNotMatch"));
      return;
    }

    if (!allPasswordValid) {
      setErrorMessage(t("register.errors.passwordRequirements"));
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(cred.user, { displayName: formData.name });
      await sendEmailVerification(cred.user);
      await bootstrapUser();

      await updateUserProfile({
        user: formData.user,
        displayName: formData.name,
        profilePicture: "/imagenes/avatares/avatar-en-blanco.webp",
      });

      const profile = await getUserProfile();
      localStorage.setItem("user", JSON.stringify(profile));
      window.dispatchEvent(new Event("storage"));

      await sendWelcomeEmail(cred.user, formData.name);

      setInfoMessage(t("register.success.verificationSent"));
      navigate("/");
    } catch (error) {
      const code = error?.code || "";
      const message = error?.message || t("register.errors.generic");

      if (code === "auth/email-already-in-use") {
        setFieldErrors({ email: t("register.errors.emailInUse"), user: "" });
        return;
      }
      if (code === "auth/invalid-email") {
        setFieldErrors({ email: t("register.errors.invalidEmail"), user: "" });
        return;
      }
      if (code === "auth/weak-password") {
        setErrorMessage(t("register.errors.weakPassword"));
        return;
      }

      if (message.toLowerCase().includes("usuario")) {
        setFieldErrors({ email: "", user: message });
        return;
      }

      setErrorMessage(message);
    }
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleRegister}>
        <h2>{t("register.title")}</h2>

        <div className="flex-column">
          <label>{t("register.labels.name")}</label>
        </div>
        <div className="inputForm">
          <input
            type="text"
            id="name"
            placeholder={t("register.placeholders.name")}
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex-column">
          <label>{t("register.labels.username")}</label>
        </div>
        <div className="inputForm">
          <input
            type="text"
            id="user"
            placeholder={t("register.placeholders.username")}
            value={formData.user}
            onChange={handleChange}
            required
          />
        </div>
        {fieldErrors.user && <p className="error-message">{fieldErrors.user}</p>}

        <div className="flex-column">
          <label>{t("register.labels.email")}</label>
        </div>
        <div className="inputForm">
          <input
            type="email"
            id="email"
            placeholder={t("register.placeholders.email")}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {emailValid !== null && (
          <p className={emailValid ? "valid-message" : "invalid-message"}>
            {emailValid
              ? t("register.emailStatus.valid")
              : t("register.emailStatus.invalid")}
          </p>
        )}
        {fieldErrors.email && <p className="error-message">{fieldErrors.email}</p>}

        <div className="flex-column">
          <label>{t("register.labels.password")}</label>
        </div>
        <div className="inputForm">
          <input
            type="password"
            id="password"
            placeholder={t("register.placeholders.password")}
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {formData.password && !allPasswordValid && (
          <div className="password-status-box">
            <p>{t("register.passwordRules.title")}</p>
            <ul className="password-status-list">
              {Object.entries(passwordRules).map(([key, label]) => (
                <li key={key} className={passwordStatus[key] ? "valid" : "invalid"}>
                  {passwordStatus[key] ? "✔" : "✘"} {label}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex-column">
          <label>{t("register.labels.confirmPassword")}</label>
        </div>
        <div className="inputForm">
          <input
            type="password"
            id="confirmPassword"
            placeholder={t("register.placeholders.confirmPassword")}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {infoMessage && <p className="info-message">{infoMessage}</p>}

        <button type="submit" className="button-submit">
          {t("register.submit")}
        </button>

        <p className="p">
          {t("register.alreadyHaveAccount")}{" "}
          <Link to="/Login" className="span">
            {t("register.login")}
          </Link>
        </p>
      </form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .form {
    display: flex;
    flex-direction: column;
    gap: 2px;
    background-color: #ffffff;
    padding: 25px;
    width: 350px;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .flex-column > label {
    color: #151717;
    font-weight: 600;
  }

  .inputForm {
    border: 1.5px solid #ecedec;
    border-radius: 10px;
    height: 45px;
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

  .inputForm:focus-within {
    border: 1.5px solid #2d79f3;
  }

  .button-submit {
    margin: 20px 0 10px 0;
    background-color: #FF751F;
    border: none;
    color: white;
    font-size: 15px;
    font-weight: 500;
    border-radius: 10px;
    height: 45px;
    width: 100%;
    cursor: pointer;
  }

  .p {
    text-align: center;
    color: black;
    font-size: 14px;
    margin: 5px 0;
  }

  .span {
    font-size: 14px;
    color: #2d79f3;
    font-weight: 500;
    cursor: pointer;
  }

  .error-message {
    color: red;
    font-size: 13px;
    margin: 4px 0 0 5px;
  }

  .info-message {
    color: #226b22;
    font-size: 13px;
    margin: 6px 0 0 5px;
  }

  .valid-message {
    color: green;
    font-size: 13px;
    margin: 4px 0 0 5px;
  }

  .invalid-message {
    color: red;
    font-size: 13px;
    margin: 4px 0 0 5px;
  }

  .password-status-box {
    background-color: #f1f1f1;
    border-radius: 8px;
    padding: 10px;
    margin: 8px 0 10px 0;
    font-size: 14px;
  }

  .password-status-list {
    list-style: none;
    padding-left: 0;
    margin: 5px 0 0 0;
  }

  .password-status-list li {
    margin-bottom: 4px;
  }

  .valid {
    color: green;
    font-weight: 500;
  }

  .invalid {
    color: red;
    font-weight: 500;
  }
`;

export default Registro;