import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically for authenticated admin requests
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('cafe_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error('Error reading token from localStorage:', e);
  }
  return config;
});

export default api;
