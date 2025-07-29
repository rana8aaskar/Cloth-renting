// API Configuration
const isDevelopment = import.meta.env.DEV;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (isDevelopment 
        ? 'http://localhost:3000/api' 
        : 'https://cloth-renting.onrender.com/api');
