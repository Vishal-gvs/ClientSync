import axios from 'axios';

const api = axios.create({
  baseURL: 'https://clientsync-backend-b1t1.onrender.com/',
  headers: { 'Content-Type': 'application/json' }
});

export default api;
