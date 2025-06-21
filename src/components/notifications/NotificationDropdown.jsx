import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { FaBell, FaEye } from 'react-icons/fa';

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #f0f0f0;
  }
  
  svg {
    font-size: 20px;
    color: #666;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const DropdownHeader = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
`;

const ViewAllButton = styled.button`
  background: none;
  border: none;
  color: #4a6cf7;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #f0f4ff;
  }
`;

const NotificationItem = styled.div`
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s ease;
  background-color: ${props => props.isRead ? '#fff' : '#f8f9ff'};
  
  &:hover {
    background-color: #f5f8ff;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const NotificationContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e0e0e0;
`;

const NotificationText = styled.div`
  flex: 1;
  
  .message {
    font-size: 14px;
    color: #333;
    margin-bottom: 4px;
    line-height: 1.4;
    
    .username {
      font-weight: 600;
      color: #4a6cf7;
    }
  }
  
  .time {
    font-size: 12px;
    color: #999;
  }
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #666;
  
  svg {
    font-size: 48px;
    color: #ddd;
    margin-bottom: 10px;
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
`;

const NotificationDropdown = ({ refreshTrigger = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, refreshTrigger]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5000/api/notifications?limit=5', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Mock data for testing
      setNotifications([
        {
          id: 'mock_1',
          type: 'private_message',
          sender_id: 2,
          user: {
            name: 'John Doe',
            username: 'johndoe',
            foto_profil: '/default-avatar.svg'
          },
          message: 'mengirim pesan: "Halo, apa kabar?"',
          timeAgo: '5 menit yang lalu',
          isRead: false
        },
        {
          id: 'mock_2',
          type: 'follow',
          sender_id: 3,
          user: {
            name: 'Jane Smith',
            username: 'janesmith',
            foto_profil: '/default-avatar.svg'
          },
          message: 'mulai mengikuti Anda',
          timeAgo: '1 jam yang lalu',
          isRead: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/notifications/${notification.id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notification.id 
            ? { ...notif, isRead: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
    
    // Navigate based on notification type
    if (notification.type === 'follow') {
      navigate(`/profil/${notification.sender_id}`);
    } else if (notification.type === 'private_message') {
      navigate(`/chat/${notification.sender_id}`);
    } else if (notification.type === 'like' || notification.type === 'comment') {
      console.log('Navigate to post:', notification.reference_id);
    }
    
    setIsOpen(false);
  };

  const handleViewAll = () => {
    navigate('/pemberitahuan');
    setIsOpen(false);
  };

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownButton onClick={() => setIsOpen(!isOpen)}>
        <FaBell />
      </DropdownButton>
      
      <DropdownMenu isOpen={isOpen}>
        <DropdownHeader>
          <h3>Notifikasi</h3>
          <ViewAllButton onClick={handleViewAll}>
            <FaEye /> Lihat Semua
          </ViewAllButton>
        </DropdownHeader>
        
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            Memuat...
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState>
            <FaBell />
            <p>Belum ada notifikasi</p>
          </EmptyState>
        ) : (
          notifications.map((notification) => (
            <NotificationItem 
              key={notification.id}
              isRead={notification.isRead}
              onClick={() => handleNotificationClick(notification)}
            >
              <NotificationContent>
                <ProfileImage 
                  src={notification.user.foto_profil ? `http://localhost:5000${notification.user.foto_profil}` : '/default-avatar.svg'} 
                  alt={notification.user.name}
                  onError={(e) => {
                    e.target.src = '/default-avatar.svg';
                  }}
                />
                <NotificationText>
                  <div className="message">
                    <span className="username">{notification.user.name}</span>
                    {' '}
                    <span>{notification.message}</span>
                  </div>
                  <div className="time">{notification.timeAgo}</div>
                </NotificationText>
              </NotificationContent>
            </NotificationItem>
          ))
        )}
      </DropdownMenu>
    </DropdownContainer>
  );
};

export default NotificationDropdown;