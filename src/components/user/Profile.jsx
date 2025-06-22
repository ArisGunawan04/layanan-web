import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaUsers, FaUserFriends, FaFileAlt, FaCamera } from 'react-icons/fa';
import axios from 'axios';
import FollowButton from '../common/FollowButton';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ProfileHeader = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const BioContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const BioTitle = styled.h3`
  margin: 0 0 15px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const AvatarContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e0e0e0;
`;

const EditAvatarButton = styled.button`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #4a6cf7;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: #3b5ce6;
  }
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  margin: 0 0 5px 0;
  font-size: 28px;
  font-weight: 700;
  color: #333;
`;

const Username = styled.p`
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #666;
  font-weight: 500;
`;

const Bio = styled.p`
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #555;
  line-height: 1.5;
`;

const JoinDate = styled.p`
  margin: 0;
  font-size: 14px;
  color: #888;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const EditButton = styled.button`
  padding: 10px 20px;
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e0e0e0;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin: 10px 0;
`;

const StatItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const StatNumber = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #333;
`;

const StatLabel = styled.span`
  font-size: 14px;
  color: #666;
  margin-top: 5px;
`;

const PostsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PostCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const PostImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const PostContent = styled.p`
  margin: 0;
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  flex: 1;
`;

const PostDate = styled.span`
  font-size: 11px;
  color: #666;
  font-style: italic;
  margin-top: 10px;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 16px;
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  margin: 20px 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
`;

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // Effect untuk memperbarui data user dari localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const userData = localStorage.getItem('user');
      const currentUserData = userData ? JSON.parse(userData) : null;
      setCurrentUser(currentUserData);
      
      // Jika ini adalah profil sendiri, update data user
      if (!userId && currentUserData) {
        setUser(currentUserData);
      }
    };
    
    // Listen untuk perubahan localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Juga check saat komponen di-focus kembali
    const handleFocus = () => {
      handleStorageChange();
    };
    
    window.addEventListener('focus', handleFocus);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [userId]);
  
  useEffect(() => {
    const fetchUserDataAndPosts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        const currentUserData = userData ? JSON.parse(userData) : null;
        
        setCurrentUser(currentUserData);
        
        let targetUserId = userId;
        if (!userId && currentUserData) {
          targetUserId = currentUserData.id;
          setUser(currentUserData);
          // Reset image states untuk profil sendiri
          setImageLoading(true);
          setImageError(false);
        } else if (userId) {
          const userResponse = await axios.get(`http://localhost:5000/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(userResponse.data.data);
          // Reset image states untuk profil lain
          setImageLoading(true);
          setImageError(false);
        }
        
        if (targetUserId) {
          const postsResponse = await axios.get(`http://localhost:5000/api/posts/user/${targetUserId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setPosts(Array.isArray(postsResponse.data) ? postsResponse.data : postsResponse.data?.data || []);
        }
      } catch (err) {
        setError('Gagal memuat data profil atau postingan');
        console.error('Error fetching user data or posts:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserDataAndPosts();
  }, [userId]);
  
  const fetchFollowCounts = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const followersRes = await axios.get(`http://localhost:5000/api/follow/${user.id}/followers/count`, { headers });
      setFollowersCount(followersRes.data.count);
      
      const followingRes = await axios.get(`http://localhost:5000/api/follow/${user.id}/following/count`, { headers });
      setFollowingCount(followingRes.data.count);
    } catch (err) {
      console.error('Error fetching follow counts:', err);
    }
  };
  
  useEffect(() => {
    fetchFollowCounts();
  }, [user]); // Jalankan ulang ketika objek user berubah
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const isOwnProfile = currentUser && user && currentUser.id === user.id;
  
  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Memuat profil...</LoadingSpinner>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }
  
  if (!user) {
    return (
      <Container>
        <ErrorMessage>Profil tidak ditemukan</ErrorMessage>
      </Container>
    );
  }
  
  return (
    <Container>
      <LeftColumn>
        <ProfileHeader>
          <ProfileInfo>
            <AvatarContainer>
              <Avatar 
                src={imageError ? '/default-avatar.svg' : (user.foto_profil ? `http://localhost:5000${user.foto_profil}` : '/default-avatar.svg')}
                alt={user.name}
                onLoad={() => setImageLoading(false)}
                onError={(e) => {
                  setImageError(true);
                  setImageLoading(false);
                  e.target.src = '/default-avatar.svg';
                }}
                style={{ opacity: imageLoading ? 0.5 : 1, transition: 'opacity 0.3s ease' }}
              />
              {false && (
                <EditAvatarButton>
                </EditAvatarButton>
              )}
            </AvatarContainer>
            
            <UserDetails>
              <UserName>{user.name}</UserName>
              <Username>@{user.username}</Username>
              <JoinDate>Bergabung {formatDate(user.createdAt)}</JoinDate>
            </UserDetails>
            
            <StatsContainer>
              <StatItem to={`/follow/${user.id}`}>
                <StatNumber>{followersCount}</StatNumber>
                <StatLabel>Followers</StatLabel>
              </StatItem>
              <StatItem to={`/follow/${user.id}`}>
                <StatNumber>{followingCount}</StatNumber>
                <StatLabel>Following</StatLabel>
              </StatItem>
            </StatsContainer>
            
            <ActionButtons>
              {isOwnProfile ? (
                <EditButton onClick={() => navigate('/edit-profil')}>
                  <FaEdit /> Edit Profil
                </EditButton>
              ) : (
                <FollowButton userId={user.id} onFollowChange={fetchFollowCounts} />
              )}
            </ActionButtons>
          </ProfileInfo>
        </ProfileHeader>
        
        <BioContainer>
          <BioTitle>Tentang Saya</BioTitle>
          <Bio>{user.bio || 'Belum ada bio'}</Bio>
        </BioContainer>
      </LeftColumn>
      
      <RightColumn>
        <PostsSection>
          <SectionTitle>
            <FaFileAlt /> {posts.length} postingan
          </SectionTitle>
          
          {!Array.isArray(posts) || posts.length === 0 ? (
            <EmptyState>
              {isOwnProfile ? 'Anda belum membuat post apapun' : 'User ini belum membuat post apapun'}
            </EmptyState>
          ) : (
            <PostsGrid>
              {posts.map(post => (
                <PostCard key={post.id || post.id_post}>
                  {post.media && (
                    <PostImage 
                      src={`http://localhost:5000${post.media}`}
                      alt="Post media"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <PostContent>{post.konten || post.caption}</PostContent>
                  <PostDate>{formatDate(post.createdAt)}</PostDate>
                </PostCard>
              ))}
            </PostsGrid>
          )}
        </PostsSection>
      </RightColumn>
    </Container>
  );
};

export default Profile;
