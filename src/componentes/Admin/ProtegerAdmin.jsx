import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtegerAdmin = ({ children }) => {
  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : null;

  if (!user) return <Navigate to="/Login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;

  return children;
};

export default ProtegerAdmin;
