// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.10.10.61:5001/api',
});

export default api;
