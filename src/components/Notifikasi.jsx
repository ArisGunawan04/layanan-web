import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';
import { FaTrash, FaCheck } from 'react-icons/fa';

const NotifikasiContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background: none;
  border: 1px solid #e0e0e0;
  color: #666;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f5f8ff;
    border-color: #4a6cf7;
    color: #4a6cf7;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const NotifikasiList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const NotifikasiItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: ${props => props.isRead ? '#fff' : '#f8f9ff'};
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  
  &:hover {
    background-color: #f5f8ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    
    .delete-button {
      opacity: 1;
      visibility: visible;
    }
  }
`;

const DeleteButton = styled.button`
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  visibility: hidden;

  &:hover {
    background: #ff3742;
    transform: translateY(-50%) scale(1.1);
  }
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
  border: 2px solid #e0e0e0;
`;

const NotifikasiContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const NotifikasiText = styled.div`
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  line-height: 1.4;
  
  .username {
    font-weight: 600;
    color: #4a6cf7;
  }
  
  .action {
    color: #666;
  }
`;

const TimeStamp = styled.div`
  font-size: 12px;
  color: #999;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  font-size: 16px;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  
  h3 {
    font-size: 18px;
    margin-bottom: 10px;
    color: #333;
  }
  
  p {
    font-size: 14px;
    line-height: 1.5;
  }
`;

const Notifikasi = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    fetchNotifications, 
    markAllAsRead, 
    deleteNotification, 
    handleNotificationClick 
  } = useNotification();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      await fetchNotifications();
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError('Gagal memuat notifikasi');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId, e) => {
    e.stopPropagation(); // Prevent triggering the notification click
    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  if (loading) {
    return (
      <NotifikasiContainer>
        <Header>
          <Title>notifikasi</Title>
        </Header>
        <LoadingContainer>
          Memuat notifikasi...
        </LoadingContainer>
      </NotifikasiContainer>
    );
  }

  if (error) {
    return (
      <NotifikasiContainer>
        <Header>
          <Title>notifikasi</Title>
        </Header>
        <EmptyState>
          <h3>Terjadi Kesalahan</h3>
          <p>{error}</p>
        </EmptyState>
      </NotifikasiContainer>
    );
  }

  return (
    <NotifikasiContainer>
      <Header>
        <Title>notifikasi</Title>
        <HeaderActions>
          {unreadCount > 0 && (
            <ActionButton onClick={handleMarkAllAsRead}>
              <FaCheck /> Tandai Semua Dibaca
            </ActionButton>
          )}
        </HeaderActions>
      </Header>
      
      {notifications.length === 0 ? (
        <EmptyState>
          <h3>Belum Ada Notifikasi</h3>
          <p>Notifikasi akan muncul di sini ketika ada aktivitas baru</p>
        </EmptyState>
      ) : (
        <NotifikasiList>
          {notifications.map((notification) => (
            <NotifikasiItem 
              key={notification.id}
              isRead={notification.isRead}
              onClick={() => handleNotificationClick(notification)}
            >
              <ProfileImage 
                src={notification.user?.foto_profil ? `http://localhost:5000${notification.user.foto_profil}` : '/default-avatar.svg'} 
                alt={notification.user?.name || 'User'}
                onError={(e) => {
                  e.target.src = '/default-avatar.svg';
                }}
              />
              <NotifikasiContent>
                <NotifikasiText>
                  <span className="action">{notification.message}</span>
                </NotifikasiText>
                <TimeStamp>{notification.timeAgo || notification.time}</TimeStamp>
              </NotifikasiContent>
              <DeleteButton 
                className="delete-button"
                onClick={(e) => handleDeleteNotification(notification.id, e)}
                title="Hapus notifikasi"
              >
                <FaTrash />
              </DeleteButton>
            </NotifikasiItem>
          ))}
        </NotifikasiList>
      )}
    </NotifikasiContainer>
  );
};

export default Notifikasi;
