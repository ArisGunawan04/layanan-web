import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import FollowButton from '../common/FollowButton';

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e0e0e0;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const Username = styled.p`
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #666;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 2px;
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ViewProfileLink = styled(Link)`
  padding: 8px 16px;
  border: 1px solid #4a6cf7;
  border-radius: 20px;
  color: #4a6cf7;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #4a6cf7;
    color: white;
  }
`;

const UserCard = ({ user, showStats = true, showActions = true }) => {
  const currentUserId = JSON.parse(localStorage.getItem('user'))?.user_id;
  const isCurrentUser = currentUserId === user.user_id;

  return (
    <Card>
      <UserInfo>
        <Avatar 
        src={user.foto_profil ? `http://localhost:5000${user.foto_profil}` : '/default-avatar.svg'}
        alt={user.name}
        onError={(e) => {
          e.target.src = '/default-avatar.svg';
        }}
        />
        <UserDetails>
          <UserName>{user.name}</UserName>
          <Username>@{user.username}</Username>
        </UserDetails>
      </UserInfo>
      
      {showStats && (
        <StatsContainer>
          <Stat>
            <StatNumber>{user.followersCount || 0}</StatNumber>
            <StatLabel>Followers</StatLabel>
          </Stat>
          <Stat>
            <StatNumber>{user.followingCount || 0}</StatNumber>
            <StatLabel>Following</StatLabel>
          </Stat>
          <Stat>
            <StatNumber>{user.postsCount || 0}</StatNumber>
            <StatLabel>Posts</StatLabel>
          </Stat>
        </StatsContainer>
      )}
      
      {showActions && (
        <ActionContainer>
          <ViewProfileLink to={`/profil/${user.user_id}`}>
            Lihat Profil
          </ViewProfileLink>
          {!isCurrentUser && (
            <FollowButton userId={user.user_id} />
          )}
        </ActionContainer>
      )}
    </Card>
  );
};

export default UserCard;