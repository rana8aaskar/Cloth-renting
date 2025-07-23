// API Configuration
const isDevelopment = import.meta.env.DEV;

export const API_BASE_URL = isDevelopment 
    ? 'http://localhost:3000/server' 
    : 'https://cloth-renting.onrender.com/server';

console.log('Current API Base URL:', API_BASE_URL);
