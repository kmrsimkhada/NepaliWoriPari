export const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : import.meta.env.PROD
    ? 'https://nepaliworipari.onrender.com/api'
    : '/api';

export const SOCKET_URL = import.meta.env.VITE_API_URL
  || (import.meta.env.PROD ? 'https://nepaliworipari.onrender.com' : '/');
