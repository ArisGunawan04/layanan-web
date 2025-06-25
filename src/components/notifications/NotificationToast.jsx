import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaTimes, FaBell, FaHeart, FaComment, FaUserPlus, FaEnvelope } from 'react-icons/fa';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
`;

const Toast = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  border: 1px solid #e0e0e0;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${props => props.isClosing ? slideOut : slideIn} 0.3s ease-in-out;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(0,0,0,0.2);
  }
`;

const IconContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => {
    switch (props.type) {
      case 'like': return '#ff6b6b';
      case 'comment': return '#4ecdc4';
      case 'follow': return '#45b7d1';
      case 'private_message': return '#96ceb4';
      default: return '#6c5ce7';
    }
  }};
  color: white;
  font-size: 16px;
`;

const ToastContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ToastTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
`;

const ToastMessage = styled.div`
  font-size: 13px;
  color: #666;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s ease;
  
  &:hover {
    color: #666;
  }
`;

const getNotificationIcon = (type) => {
  switch (type) {
    case 'like': return <FaHeart />;
    case 'comment': return <FaComment />;
    case 'follow': return <FaUserPlus />;
    case 'private_message': return <FaEnvelope />;
    default: return <FaBell />;
  }
};

const getNotificationTitle = (type) => {
  switch (type) {
    case 'like': return 'Postingan Disukai';
    case 'comment': return 'Komentar Baru';
    case 'follow': return 'Pengikut Baru';
    case 'private_message': return 'Pesan Baru';
    default: return 'Notifikasi';
  }
};

const NotificationToast = ({ notifications, onClose, onToastClick }) => {
  const [closingToasts, setClosingToasts] = useState(new Set());

  useEffect(() => {
    // Auto close toasts after 5 seconds
    notifications.forEach(notification => {
      const timer = setTimeout(() => {
        handleClose(notification.id);
      }, 5000);

      return () => clearTimeout(timer);
    });
  }, [notifications]);

  const handleClose = (id) => {
    setClosingToasts(prev => new Set([...prev, id]));
    setTimeout(() => {
      onClose(id);
      setClosingToasts(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 300);
  };

  const handleToastClick = (notification) => {
    if (onToastClick) {
      onToastClick(notification);
    }
    handleClose(notification.id);
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <ToastContainer>
      {notifications.map((notification) => (
        <Toast 
          key={notification.id}
          isClosing={closingToasts.has(notification.id)}
          onClick={() => handleToastClick(notification)}
        >
          <IconContainer type={notification.type}>
            {getNotificationIcon(notification.type)}
          </IconContainer>
          
          <ToastContent>
            <ToastTitle>{getNotificationTitle(notification.type)}</ToastTitle>
            <ToastMessage>
              <strong>{notification.user?.name || 'Seseorang'}</strong> {notification.message}
            </ToastMessage>
          </ToastContent>
          
          <CloseButton 
            onClick={(e) => {
              e.stopPropagation();
              handleClose(notification.id);
            }}
          >
            <FaTimes />
          </CloseButton>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default NotificationToast;