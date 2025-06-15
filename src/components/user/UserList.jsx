import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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

const Subtitle = styled.p`
  color: #666;
  font-size: 16px;
  margin: 0;
`;

const SearchContainer = styled.div`
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #4a6cf7;
  }
  
  &::placeholder {
    color: #999;
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

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users berdasarkan search term
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Gagal memuat daftar pengguna');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          Memuat daftar pengguna...
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Temukan Pengguna</Title>
        <Subtitle>Cari dan ikuti pengguna lain untuk melihat konten mereka</Subtitle>
      </Header>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Cari pengguna berdasarkan nama atau username..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </SearchContainer>
      
      {filteredUsers.length === 0 ? (
        <EmptyState>
          {searchTerm ? 'Tidak ada pengguna yang ditemukan' : 'Belum ada pengguna lain'}
        </EmptyState>
      ) : (
        <UsersGrid>
          {filteredUsers.map(user => (
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

export default UserList;