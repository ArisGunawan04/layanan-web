import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import UserCard from './UserCard';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 12px 24px;
  border: none;
  background: none;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.$active ? '#4a6cf7' : '#666'};
  border-bottom: 2px solid ${props => props.$active ? '#4a6cf7' : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: #4a6cf7;
  }
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 16px;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const ErrorMessage = styled.div`
  background-color: #fee;
  color: #c33;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
`;

const CountBadge = styled.span`
  background-color: #4a6cf7;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-left: 8px;
`;

const FollowList = ({ initialTab = 'followers' }) => {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFollowData();
  }, [userId]);

  const fetchFollowData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch followers dan following secara bersamaan
      const [followersResponse, followingResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/follow/${userId}/followers`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:5000/api/follow/${userId}/following`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setFollowers(followersResponse.data.followers || []);
      setFollowing(followingResponse.data.following || []);
    } catch (error) {
      console.error('Error fetching follow data:', error);
      setError('Gagal memuat data follow');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUsers = () => {
    return activeTab === 'followers' ? followers : following;
  };

  const getEmptyMessage = () => {
    return activeTab === 'followers' 
      ? 'Belum ada yang mengikuti'
      : 'Belum mengikuti siapa pun';
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          Memuat data follow...
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Follow</Title>
      </Header>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <TabContainer>
        <Tab 
          $active={activeTab === 'followers'}
          onClick={() => setActiveTab('followers')}
        >
          Followers
          <CountBadge>{followers.length}</CountBadge>
        </Tab>
        <Tab 
          $active={activeTab === 'following'}
          onClick={() => setActiveTab('following')}
        >
          Following
          <CountBadge>{following.length}</CountBadge>
        </Tab>
      </TabContainer>
      
      {getCurrentUsers().length === 0 ? (
        <EmptyState>
          {getEmptyMessage()}
        </EmptyState>
      ) : (
        <UsersGrid>
          {getCurrentUsers().map(user => (
            <UserCard
              key={user.user_id}
              user={user}
              showStats={false}
            />
          ))}
        </UsersGrid>
      )}
    </Container>
  );
};

export default FollowList;