import React, { useState } from "react";
import styled from "styled-components";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function OlvidarPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSend = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      setMsg({ type: "error", text: "Introduce un correo válido." });
      return;
    }

    try {
      setLoading(true);

      // ✅ Enviar email (Firebase)
      await sendPasswordResetEmail(auth, email);

      // ✅ Mensaje de éxito (sin filtrar si existe o no)
      setMsg({
        type: "success",
        text: "Si el correo existe, te hemos enviado un enlace. Revisa tu email (y spam).",
      });

      // ✅ Espera corta y vuelve a Login con state
      setTimeout(() => {
        navigate("/Login", {
          replace: true,
          state: {
            resetInfo:
              "Si el correo existe, se ha enviado un enlace para restablecer la contraseña. Revisa tu email (y spam).",
          },
        });
      }, 1200);
    } catch (err) {
      // Por seguridad: mismo mensaje aunque falle
      setMsg({
        type: "success",
        text: "Si el correo existe, te hemos enviado un enlace. Revisa tu email (y spam).",
      });

      setTimeout(() => {
        navigate("/Login", {
          replace: true,
          state: {
            resetInfo:
              "Si el correo existe, se ha enviado un enlace para restablecer la contraseña. Revisa tu email (y spam).",
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
        <h2>Recuperar contraseña</h2>
        <p className="sub">
          Escribe tu correo y te enviaremos un enlace para cambiar la contraseña.
        </p>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />

        {msg.text && <div className={`msg ${msg.type}`}>{msg.text}</div>}

        <button disabled={loading} type="submit">
          {loading ? "Enviando..." : "Enviar enlace"}
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