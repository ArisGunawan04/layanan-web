import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaHeart, FaRegHeart, FaComment, FaEllipsisH } from 'react-icons/fa';
import axios from 'axios';

const BerandaContainer = styled.div`
  margin-left: 220px;
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const CreatePostCard = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin-bottom: 20px;
`;

const CreatePostForm = styled.div`
  display: flex;
  align-items: center;
`;

const ProfilePic = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
`;

const PostInput = styled.input`
  flex: 1;
  border: none;
  background-color: #f0f2f5;
  border-radius: 20px;
  padding: 10px 15px;
  font-size: 14px;
  outline: none;
  
  &::placeholder {
    color: #65676b;
  }
`;

const FeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PostCard = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
`;

const PostUser = styled.div`
  display: flex;
  align-items: center;
`;

const UserInfo = styled.div`
  margin-left: 10px;
`;

const UserName = styled.h3`
  font-size: 14px;
  font-weight: 600;
  margin: 0;
`;

const PostTime = styled.p`
  font-size: 12px;
  color: #65676b;
  margin: 0;
`;

const MoreOptions = styled.div`
  cursor: pointer;
  color: #65676b;
`;

const PostContent = styled.div`
  padding: 0 15px 15px;
`;

const PostText = styled.p`
  margin: 0 0 10px;
  font-size: 14px;
  line-height: 1.5;
`;

const PostImage = styled.img`
  width: 100%;
  max-height: 500px;
  object-fit: cover;
`;

const PostActions = styled.div`
  display: flex;
  padding: 10px 15px;
  border-top: 1px solid #e4e6eb;
`;

const LikeCount = styled.div`
  font-size: 14px;
  color: #65676b;
  margin-top: 5px;
  margin-bottom: 10px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: ${props => props.active ? '#4a6cf7' : '#65676b'};
  font-size: 14px;
  font-weight: 600;
  padding: 8px 12px;
  cursor: pointer;
  flex: 1;
  justify-content: center;
  
  &:hover {
    background-color: #f0f2f5;
    border-radius: 4px;
  }
`;

const ActionIcon = styled.span`
  margin-right: 5px;
  font-size: 16px;
`;

const StoryContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 0;
  margin-bottom: 20px;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const StoryCard = styled.div`
  min-width: 110px;
  height: 180px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border: 2px solid ${props => props.active ? '#4a6cf7' : 'transparent'};
`;

const StoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StoryUser = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  text-align: center;
  color: white;
  font-size: 12px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
`;

const Beranda = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [newPostText, setNewPostText] = useState('');
  
  // Contoh data story
  const stories = [
    { id: 1, user: 'Jon Snow', image: 'https://i.imgur.com/7vQD0fPs.jpg' },
    { id: 2, user: 'Daenerys', image: 'https://i.imgur.com/4KeKvtH.png' },
    { id: 3, user: 'Man Utd', image: 'https://i.imgur.com/ZXOvx4a.png' }
  ];
  
  useEffect(() => {
    // Ambil data user dari localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user'); // Hapus data user yang tidak valid
      }
    }
    
    // Ambil data posts dari API
    fetchPosts();
  }, []);
  
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Silakan login terlebih dahulu');
        setLoading(false);
        // Redirect ke halaman login
        window.location.href = '/login';
        return;
      }
      
      try {
        const response = await axios.get('http://localhost:5000/api/posts', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setPosts(response.data.data || []);
        setLoading(false);
      } catch (apiError) {
        // Jika token tidak valid (401), redirect ke login
        if (apiError.response && apiError.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        setError(apiError.message);
        setLoading(false);
        console.error('Error fetching posts:', apiError);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error('Error dalam fungsi fetchPosts:', err);
    }
  };
  
  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }
      
      // Cek apakah post sudah dilike
      const isLiked = posts.find(post => post.id_post === postId)?.isLiked;
      
      if (isLiked) {
        // Unlike post
        await axios.delete(`http://localhost:5000/api/likes/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        // Like post
        await axios.post('http://localhost:5000/api/likes', {
          id_post: postId
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      // Refresh posts
      fetchPosts();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };
  
  const handleCreatePost = async () => {
    if (!newPostText.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }
      
      await axios.post('http://localhost:5000/api/posts', {
        caption: newPostText
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setNewPostText('');
      fetchPosts();
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };
  
  const formatTime = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - postTime) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} detik yang lalu`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
    }
  };
  
  if (loading) {
    return <BerandaContainer>Loading...</BerandaContainer>;
  }
  
  if (error) {
    return <BerandaContainer>Error: {error}</BerandaContainer>;
  }
  
  return (
    <BerandaContainer>
      <ContentWrapper>
        <StoryContainer>
          {stories.map(story => (
            <StoryCard key={story.id}>
              <StoryImage src={story.image} alt={story.user} />
              <StoryUser>{story.user}</StoryUser>
            </StoryCard>
          ))}
        </StoryContainer>
        
        <CreatePostCard>
          <CreatePostForm>
            <ProfilePic src={user?.profile_picture || "https://via.placeholder.com/40"} alt="Profile" />
            <PostInput 
              placeholder="Ketikan sesuatu..." 
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreatePost()}
            />
          </CreatePostForm>
        </CreatePostCard>
        
        <FeedContainer>
          {posts.map(post => (
            <PostCard key={post.id_post}>
              <PostHeader>
                <PostUser>
                  <ProfilePic 
                    src={post.User?.profile_picture || "https://via.placeholder.com/40"} 
                    alt={post.User?.name} 
                  />
                  <UserInfo>
                    <UserName>{post.User?.name || "User"}</UserName>
                    <PostTime>{formatTime(post.createdAt)}</PostTime>
                  </UserInfo>
                </PostUser>
                <MoreOptions>
                  <FaEllipsisH />
                </MoreOptions>
              </PostHeader>
              
              {post.caption && (
                <PostContent>
                  <PostText>{post.caption}</PostText>
                </PostContent>
              )}
              
              {post.media && (
                <PostImage src={`http://localhost:5000${post.media}`} alt="Post" />
              )}
              
              <LikeCount>{post.likeCount || 0} suka</LikeCount>
              
              <PostActions>
                <ActionButton 
                  active={post.isLiked} 
                  onClick={() => handleLike(post.id_post)}
                >
                  <ActionIcon>
                    {post.isLiked ? <FaHeart /> : <FaRegHeart />}
                  </ActionIcon>
                  Suka
                </ActionButton>
                
                <ActionButton>
                  <ActionIcon>
                    <FaComment />
                  </ActionIcon>
                  Komentar
                </ActionButton>
              </PostActions>
            </PostCard>
          ))}
        </FeedContainer>
      </ContentWrapper>
    </BerandaContainer>
  );
};

export default Beranda;
