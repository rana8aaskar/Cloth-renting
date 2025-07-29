import axios from 'axios';
import { signOutUserSuccess } from '../redux/user/userSlice.js';

// Create an axios interceptor to handle authentication errors
export const setupAuthInterceptor = (store, navigate) => {
  // Response interceptor to handle 401 errors globally
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Clear user from Redux store
        store.dispatch(signOutUserSuccess());
        
        // Show user-friendly message
        console.log('Session expired. Please sign in again.');
        
        // Redirect to sign-in page
        navigate('/sign-in');
      }
      return Promise.reject(error);
    }
  );
};

export default setupAuthInterceptor;
