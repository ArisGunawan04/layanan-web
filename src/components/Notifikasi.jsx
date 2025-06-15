import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

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
  
  &:hover {
    background-color: #f5f8ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5001/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const formattedNotifications = response.data.data.map(notif => ({
          ...notif,
          time: notif.timeAgo
        }));
        setNotifications(formattedNotifications);
      } else {
        setError('Gagal memuat notifikasi');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      // Fallback ke data mock jika API gagal
      const mockNotifications = [
        {
          id: 'mock_1',
          type: 'follow',
          user: {
            name: 'sudibjo pramono',
            username: 'sudibjo_pramono',
            foto_profil: 'https://via.placeholder.com/50'
          },
          message: 'mulai mengikuti Anda',
          time: '2 jam yang lalu',
          isRead: false
        },
        {
          id: 'mock_2',
          type: 'like',
          user: {
            name: 'sudibjo pramono',
            username: 'sudibjo_pramono', 
            foto_profil: 'https://via.placeholder.com/50'
          },
          message: 'menyukai postingan Anda "glory glory man utd"',
          time: '5 jam yang lalu',
          isRead: false
        }
      ];
      setNotifications(mockNotifications);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notification.id 
          ? { ...notif, isRead: true }
          : notif
      )
    );
    
    // Navigate based on notification type
    if (notification.type === 'follow') {
      // Navigate to user profile
      console.log('Navigate to profile:', notification.user.username);
    } else if (notification.type === 'like' || notification.type === 'comment') {
      // Navigate to post
      console.log('Navigate to post');
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
                src={notification.user.foto_profil} 
                alt={notification.user.name}
              />
              <NotifikasiContent>
                <NotifikasiText>
                  <span className="username">{notification.user.name}</span>
                  {' '}
                  <span className="action">{notification.message}</span>
                </NotifikasiText>
                <TimeStamp>{notification.time}</TimeStamp>
              </NotifikasiContent>
            </NotifikasiItem>
          ))}
        </NotifikasiList>
      )}
    </NotifikasiContainer>
  );
};

export default Notifikasi;