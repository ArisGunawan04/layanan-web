import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const GroupListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const GroupCard = styled(Link)`
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const GroupName = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
`;

const GroupDescription = styled.p`
  font-size: 14px;
  color: #666;
`;

const CreateGroupButton = styled(Link)`
  display: inline-block;
  background-color: #4a6cf7;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  margin-bottom: 20px;
`;

const GroupList = () => {
  console.log('GroupList component rendered'); // Tambahkan log ini
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useEffect in GroupList triggered'); // Tambahkan log ini
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/groups/my-groups`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Fetched groups data:', response.data);
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Title>Grup Saya</Title>
      <CreateGroupButton to="/groups/create">Buat Grup Baru</CreateGroupButton>
      <GroupListContainer>
        {groups.map(groupMember => (
          <GroupCard key={groupMember.Group.id_group} to={`/groups/${groupMember.Group.id_group}`}>
            <GroupName>{groupMember.Group.nama_group}</GroupName>
            <GroupDescription>{groupMember.Group.deskripsi}</GroupDescription>
          </GroupCard>
        ))}
      </GroupListContainer>
    </Container>
  );
};

export default GroupList;
