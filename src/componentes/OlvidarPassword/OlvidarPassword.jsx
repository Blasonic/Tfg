import React, { useState } from "react";
import styled from "styled-components";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { auth } from "../../firebase";

export default function OlvidarPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const successMessage = t("forgotPassword.success");
  const loginInfoMessage = t("forgotPassword.loginInfo");

  const handleSend = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      setMsg({ type: "error", text: t("forgotPassword.errors.invalidEmail") });
      return;
    }

    try {
      setLoading(true);

      await sendPasswordResetEmail(auth, email);

      setMsg({
        type: "success",
        text: successMessage,
      });

      setTimeout(() => {
        navigate("/Login", {
          replace: true,
          state: {
            resetInfo: loginInfoMessage,
          },
        });
      }, 1200);
    } catch (err) {
      setMsg({
        type: "success",
        text: successMessage,
      });

      setTimeout(() => {
        navigate("/Login", {
          replace: true,
          state: {
            resetInfo: loginInfoMessage,
          },
        });
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrap>
      <form className="card" onSubmit={handleSend}>
        <h2>{t("forgotPassword.title")}</h2>
        <p className="sub">{t("forgotPassword.subtitle")}</p>

        <input
          type="email"
          placeholder={t("forgotPassword.placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />

        {msg.text && <div className={`msg ${msg.type}`}>{msg.text}</div>}

        <button disabled={loading} type="submit">
          {loading
            ? t("forgotPassword.buttons.sending")
            : t("forgotPassword.buttons.sendLink")}
        </button>
      </form>
    </Wrap>
  );
}

const Wrap = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  .card {
    width: 360px;
    background: #fff;
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  h2 {
    margin: 0;
  }

  .sub {
    margin: 0;
    color: #666;
    font-size: 14px;
    line-height: 1.4;
  }

  input {
    height: 46px;
    border-radius: 10px;
    border: 1.5px solid #ececec;
    padding: 0 12px;
    outline: none;
  }

  button {
    height: 46px;
    border: 0;
    border-radius: 10px;
    background: #FF751F;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.75;
    cursor: not-allowed;
  }

  .msg {
    padding: 10px 12px;
    border-radius: 10px;
    font-size: 13px;
    border: 1px solid transparent;
  }

  .msg.success {
    background: #eef8ee;
    border-color: #cbe8cb;
    color: #226b22;
  }

  .msg.error {
    background: #fdecec;
    border-color: #f5c3c3;
    color: #8a1f1f;
  }
`;