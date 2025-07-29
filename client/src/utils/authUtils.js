// Simple utility to check if user is authenticated
export const checkAuth = (currentUser, navigate, showError) => {
  if (!currentUser) {
    if (showError) {
      showError('Please sign in to continue');
    }
    navigate('/sign-in');
    return false;
  }
  return true;
};

// Utility to handle 401 errors
export const handle401Error = (error, navigate, showError) => {
  if (error.response?.status === 401) {
    if (showError) {
      showError('Session expired. Please sign in again.');
    }
    setTimeout(() => {
      navigate('/sign-in');
    }, 1500);
    return true;
  }
  return false;
};
