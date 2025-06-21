import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const SearchContainer = styled.div`
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #4a6cf7;
  }
`;

const GroupListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const GroupCard = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const GroupName = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
`;

const GroupDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

const GroupInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const AdminInfo = styled.div`
  font-size: 12px;
  color: #888;
`;

const MemberCount = styled.div`
  font-size: 12px;
  color: #888;
`;

const JoinButton = styled.button`
  background-color: #4a6cf7;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #3b5ce6;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const NoGroupsMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const SearchGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [joiningGroupId, setJoiningGroupId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchAvailableGroups = async (search = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/groups/available${
        search ? `?search=${encodeURIComponent(search)}` : ''
      }`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setGroups(data.data);
      } else {
        setMessage({ type: 'error', text: data.message || 'Gagal mengambil data grup' });
      }
    } catch (error) {
      console.error('Error fetching available groups:', error);
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat mengambil data grup' });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      setJoiningGroupId(groupId);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/groups/${groupId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Berhasil bergabung dengan grup!' });
        // Hapus grup dari daftar karena user sudah bergabung
        setGroups(groups.filter(group => group.id_group !== groupId));
      } else {
        setMessage({ type: 'error', text: data.message || 'Gagal bergabung dengan grup' });
      }
    } catch (error) {
      console.error('Error joining group:', error);
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat bergabung dengan grup' });
    } finally {
      setJoiningGroupId(null);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchAvailableGroups(value);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  useEffect(() => {
    fetchAvailableGroups();
  }, []);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <Container>
      <Title>Cari Grup</Title>
      
      {message.text && (
        message.type === 'error' ? (
          <ErrorMessage>{message.text}</ErrorMessage>
        ) : (
          <SuccessMessage>{message.text}</SuccessMessage>
        )
      )}
      
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Cari nama grup..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </SearchContainer>

      {loading ? (
        <LoadingMessage>Memuat grup yang tersedia...</LoadingMessage>
      ) : groups.length === 0 ? (
        <NoGroupsMessage>
          {searchTerm ? 
            `Tidak ada grup yang ditemukan dengan kata kunci "${searchTerm}"` : 
            'Tidak ada grup yang tersedia untuk bergabung'
          }
        </NoGroupsMessage>
      ) : (
        <GroupListContainer>
          {groups.map(group => (
            <GroupCard key={group.id_group}>
              <GroupName>{group.nama_group}</GroupName>
              <GroupDescription>{group.deskripsi}</GroupDescription>
              
              <GroupInfo>
                <AdminInfo>
                  Admin: {group.Admin?.name || group.Admin?.username || 'Unknown'}
                </AdminInfo>
                <MemberCount>
                  {group.memberCount} member{group.memberCount !== 1 ? 's' : ''}
                </MemberCount>
              </GroupInfo>
              
              <JoinButton
                onClick={() => handleJoinGroup(group.id_group)}
                disabled={joiningGroupId === group.id_group}
              >
                {joiningGroupId === group.id_group ? 'Bergabung...' : 'Bergabung'}
              </JoinButton>
            </GroupCard>
          ))}
        </GroupListContainer>
      )}
    </Container>
  );
};

export default SearchGroups;