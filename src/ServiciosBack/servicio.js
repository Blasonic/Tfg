const API_URL = 'http://localhost:5000/api/auth';

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/Registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  return response.json();
};

export const loginUser = async (userData) => {
  const response = await fetch(`${API_URL}/Login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem('user', JSON.stringify(data.user)); // Guarda el usuario
    localStorage.setItem('token', data.token); // Guarda el token
  }

  return data;
};

export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// 🔹 Obtener perfil con token
export const getUserProfile = async () => {
  const token = localStorage.getItem('token');

  if (!token) throw new Error('No hay token disponible');

  const response = await fetch(`${API_URL}/perfil`, {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) throw new Error('Error al obtener el perfil');

  return response.json();
};

// 🔹 Actualizar perfil con token
export const updateUserProfile = async (updatedData) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`http://localhost:5000/api/auth/perfil`, {
    method: 'PUT',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedData), // updatedData debe contener solo { user, profilePicture }
  });

  if (!response.ok) throw new Error('Error al actualizar el perfil');

  return response.json();
};
