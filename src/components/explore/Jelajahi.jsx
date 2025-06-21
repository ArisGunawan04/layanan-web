import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaUser, FaUsers } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';
import FollowButton from '../common/FollowButton';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 28px;
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
  position: relative;
  margin-bottom: 30px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 20px 15px 50px;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #4a6cf7;
    box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 18px;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 30px;
  border-bottom: 2px solid #f0f0f0;
`;

const Tab = styled.button`
  flex: 1;
  padding: 15px 20px;
  border: none;
  background: none;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.$active ? '#4a6cf7' : '#666'};
  border-bottom: 3px solid ${props => props.$active ? '#4a6cf7' : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    color: #4a6cf7;
    background: #f5f8ff;
  }
`;

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  margin: 0 0 5px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const Username = styled.p`
  margin: 0 0 5px 0;
  color: #666;
  font-size: 14px;
`;

const UserBio = styled.p`
  margin: 0;
  color: #888;
  font-size: 14px;
  line-height: 1.4;
`;

const GroupCard = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const GroupIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4a6cf7, #667eea);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: white;
  font-size: 24px;
`;

const GroupInfo = styled.div`
  flex: 1;
`;

const GroupName = styled.h3`
  margin: 0 0 5px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const GroupDescription = styled.p`
  margin: 0 0 5px 0;
  color: #888;
  font-size: 14px;
  line-height: 1.4;
`;

const GroupStats = styled.div`
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #666;
`;

const JoinButton = styled.button`
  padding: 8px 16px;
  background: #4a6cf7;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #3b5ce6;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 16px;
  margin: 0;
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const GroupModalIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background: linear-gradient(135deg, #4a6cf7, #667eea);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  margin: 0 auto 20px;
`;

const GroupModalName = styled.h3`
  text-align: center;
  margin: 0 0 10px 0;
  font-size: 22px;
  font-weight: 600;
  color: #333;
`;

const GroupModalDescription = styled.p`
  text-align: center;
  margin: 0 0 20px 0;
  color: #666;
  font-size: 16px;
  line-height: 1.5;
`;

const GroupModalStats = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #4a6cf7;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
`;

const AdminInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const AdminAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #4a6cf7;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
`;

const AdminDetails = styled.div`
  flex: 1;
`;

const AdminName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
`;

const AdminRole = styled.div`
  font-size: 12px;
  color: #666;
`;

const ModalJoinButton = styled.button`
  width: 100%;
  padding: 12px 20px;
  background: #4a6cf7;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #3b5ce6;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px;
  
  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4a6cf7;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Jelajahi = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [joiningGroupId, setJoiningGroupId] = useState(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const fetchUsers = async (query = '') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = query.trim() 
        ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/users?search=${encodeURIComponent(query)}`
        : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/users`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(response.data || []);
      setHasSearched(true);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async (query = '') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/groups/available${
        query.trim() ? `?search=${encodeURIComponent(query)}` : ''
      }`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setGroups(data.data || []);
      } else {
        setGroups([]);
      }
      setHasSearched(true);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setGroups([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (activeTab === 'users') {
      fetchUsers(query);
    } else {
      fetchGroups(query);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'users') {
      fetchUsers(searchQuery);
    } else {
      fetchGroups(searchQuery);
    }
  };

  const joinGroup = async (groupId) => {
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
        // Hapus grup dari daftar karena user sudah bergabung
        setGroups(groups.filter(group => group.id_group !== groupId));
        // Tutup modal jika sedang terbuka
        if (showGroupModal) {
          setShowGroupModal(false);
          setSelectedGroup(null);
        }
      }
    } catch (error) {
      console.error('Error joining group:', error);
    } finally {
      setJoiningGroupId(null);
    }
  };

  const openGroupModal = (group) => {
    setSelectedGroup(group);
    setShowGroupModal(true);
  };

  const closeGroupModal = () => {
    setShowGroupModal(false);
    setSelectedGroup(null);
  };

  // Load initial data when component mounts or tab changes
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else {
      fetchGroups();
    }
  }, [activeTab]);

  return (
    <Container>
      <Header>
        <Title>Jelajahi</Title>
        <Subtitle>Temukan pengguna dan grup baru untuk terhubung</Subtitle>
      </Header>

      <SearchContainer>
        <SearchIcon>
          <FaSearch />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder={`Cari ${activeTab === 'users' ? 'pengguna' : 'grup'}...`}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </SearchContainer>

      <TabContainer>
        <Tab 
          $active={activeTab === 'users'} 
          onClick={() => handleTabChange('users')}
        >
          <FaUser />
          Pengguna
        </Tab>
        <Tab 
          $active={activeTab === 'groups'} 
          onClick={() => handleTabChange('groups')}
        >
          <FaUsers />
          Grup
        </Tab>
      </TabContainer>

      <ResultsContainer>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {activeTab === 'users' ? (
              users.length > 0 ? (
                users.map(user => (
                  <UserCard key={user.user_id}>
                    <Link to={`/profil/${user.user_id}`} style={{ display: 'flex', alignItems: 'center', flex: 1, textDecoration: 'none', color: 'inherit' }}>
                      <Avatar 
                        src={user.profile_picture ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${user.profile_picture}` : '/src/assets/default-avatar.png'} 
                        alt={user.name}
                      />
                      <UserInfo>
                        <UserName>{user.name}</UserName>
                        <Username>@{user.username}</Username>
                        {user.bio && <UserBio>{user.bio}</UserBio>}
                      </UserInfo>
                    </Link>
                    <FollowButton userId={user.user_id} />
                  </UserCard>
                ))
              ) : (
                <EmptyState>
                  <EmptyIcon><FaUser /></EmptyIcon>
                  <EmptyText>
                    {searchQuery ? 'Tidak ada pengguna yang ditemukan' : 'Tidak ada pengguna tersedia'}
                  </EmptyText>
                </EmptyState>
              )
            ) : (
              groups.length > 0 ? (
                groups.map(group => (
                  <GroupCard key={group.id_group}>
                    <div 
                      style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' }}
                      onClick={() => openGroupModal(group)}
                    >
                      <GroupIcon>
                        <FaUsers />
                      </GroupIcon>
                      <GroupInfo>
                        <GroupName>{group.nama_group}</GroupName>
                        <GroupDescription>{group.deskripsi}</GroupDescription>
                        <GroupStats>
                          <span>{group.GroupMembers?.length || group.jumlah_anggota || group.memberCount || 0} anggota</span>
                          <span>•</span>
                          <span>Admin: {group.Admin?.name || group.Admin?.username || 'Unknown'}</span>
                        </GroupStats>
                      </GroupInfo>
                    </div>
                    <JoinButton 
                       onClick={(e) => {
                         e.stopPropagation();
                         joinGroup(group.id_group);
                       }}
                       disabled={joiningGroupId === group.id_group}
                     >
                       {joiningGroupId === group.id_group ? 'Bergabung...' : 'Bergabung'}
                     </JoinButton>
                  </GroupCard>
                ))
              ) : (
                <EmptyState>
                  <EmptyIcon><FaUsers /></EmptyIcon>
                  <EmptyText>
                    {searchQuery ? 'Tidak ada grup yang ditemukan' : 'Tidak ada grup tersedia untuk bergabung'}
                  </EmptyText>
                </EmptyState>
              )
            )}
          </>
        )}
      </ResultsContainer>

      {/* Modal Detail Grup */}
      {showGroupModal && selectedGroup && (
        <ModalOverlay onClick={closeGroupModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Detail Grup</ModalTitle>
              <CloseButton onClick={closeGroupModal}>
                ×
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <GroupModalIcon>
                <FaUsers />
              </GroupModalIcon>
              
              <GroupModalName>{selectedGroup.nama_group}</GroupModalName>
              
              {selectedGroup.deskripsi && (
                <GroupModalDescription>
                  {selectedGroup.deskripsi}
                </GroupModalDescription>
              )}
              
              <GroupModalStats>
                <StatItem>
                  <StatNumber>{selectedGroup.GroupMembers?.length || selectedGroup.jumlah_anggota || selectedGroup.memberCount || 0}</StatNumber>
                  <StatLabel>Anggota</StatLabel>
                </StatItem>
                <StatItem>
                  <StatNumber>Publik</StatNumber>
                  <StatLabel>Tipe Grup</StatLabel>
                </StatItem>
              </GroupModalStats>
              
              <AdminInfo>
                <AdminAvatar>
                  {(selectedGroup.Admin?.name || selectedGroup.Admin?.username || 'A').charAt(0).toUpperCase()}
                </AdminAvatar>
                <AdminDetails>
                  <AdminName>{selectedGroup.Admin?.name || selectedGroup.Admin?.username || 'Unknown'}</AdminName>
                  <AdminRole>Administrator Grup</AdminRole>
                </AdminDetails>
              </AdminInfo>
              
              <ModalJoinButton 
                onClick={() => joinGroup(selectedGroup.id_group)}
                disabled={joiningGroupId === selectedGroup.id_group}
              >
                {joiningGroupId === selectedGroup.id_group ? 'Bergabung...' : 'Bergabung ke Grup'}
              </ModalJoinButton>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Jelajahi;