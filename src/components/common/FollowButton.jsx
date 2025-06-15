import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
  
  ${props => props.isFollowing ? `
    background-color: #e0e0e0;
    color: #666;
    
    &:hover {
      background-color: #ff4444;
      color: white;
    }
    
    &:hover::after {
      content: 'Unfollow';
    }
    
    &::after {
      content: 'Following';
    }
  ` : `
    background-color: #4a6cf7;
    color: white;
    
    &:hover {
      background-color: #3b5ce6;
    }
    
    &::after {
      content: 'Follow';
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FollowButton = ({ userId, onFollowChange }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    checkFollowStatus();
  }, [userId]);

  const checkFollowStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/follow/${userId}/status`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error('Error checking follow status:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = `http://localhost:5000/api/follow/${userId}`;
      
      if (isFollowing) {
        await axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFollowing(false);
      } else {
        await axios.post(url, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFollowing(true);
      }
      
      // Callback untuk update parent component jika diperlukan
      if (onFollowChange) {
        onFollowChange(!isFollowing);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      alert('Terjadi kesalahan saat mengubah status follow');
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return <Button disabled>Loading...</Button>;
  }

  return (
    <Button
      isFollowing={isFollowing}
      onClick={handleFollowToggle}
      disabled={loading}
    />
  );
};

export default FollowButton;