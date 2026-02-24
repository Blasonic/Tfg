// src/componentes/Admin/ProtegerAdmin.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../firebase";

const ProtegerAdmin = ({ children }) => {
  const [status, setStatus] = useState("loading"); // loading | ok | noauth | forbidden

  useEffect(() => {
    const run = async () => {
      const u = auth.currentUser;
      if (!u) return setStatus("noauth");

      // Fuerza refresh para claims admin
      const tokenResult = await u.getIdTokenResult(true);
      const isAdmin = tokenResult?.claims?.admin === true;

      setStatus(isAdmin ? "ok" : "forbidden");
    };

    run();
  }, []);

  if (status === "loading") return null;
  if (status === "noauth") return <Navigate to="/Login" />;
  if (status === "forbidden") return <Navigate to="/" />;

  return children;
};

export default ProtegerAdmin;