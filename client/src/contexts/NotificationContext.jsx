import React, { createContext, useContext, useState } from 'react';
import Notification from '../components/Notification';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, message, duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = { id, type, message, duration };
    
    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showSuccess = (message, duration) => addNotification('success', message, duration);
  const showError = (message, duration) => addNotification('error', message, duration);
  const showInfo = (message, duration) => addNotification('info', message, duration);

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      <div className="notification-container">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            style={{
              position: 'fixed',
              top: `${20 + index * 80}px`,
              right: '20px',
              zIndex: 1000,
            }}
          >
            <Notification
              type={notification.type}
              message={notification.message}
              duration={notification.duration}
              onClose={() => removeNotification(notification.id)}
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
