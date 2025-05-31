import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaHeart, FaRegHeart, FaComment, FaEllipsisH } from 'react-icons/fa';
import axios from 'axios';

const ContentWrapper = styled.div`
  max-width: 750px;
  margin: 0;
  margin-left: 50px;
`;

const CreatePostCard = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
`;

const CreatePostForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PostInputRow = styled.div`
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

const PostInput = styled.textarea`
  flex: 1;
  border: none;
  background-color: #f0f2f5;
  border-radius: 20px;
  padding: 10px 15px;
  font-size: 14px;
  outline: none;
  resize: none;
  min-height: 40px;
  max-height: 120px;
  font-family: inherit;
  
  &::placeholder {
    color: #65676b;
  }
`;

const CreatePostActions = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  align-items: center;
  padding-left: 55px;
`;

const MediaUpload = styled.input`
  display: none;
`;

const MediaButton = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  background-color: #f0f2f5;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #65676b;
  
  &:hover {
    background-color: #e4e6eb;
  }
`;

const SubmitButton = styled.button`
  background-color: #4a6cf7;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background-color: #3b5bdb;
  }
  
  &:disabled {
    background-color: #e4e6eb;
    color: #bcc0c4;
    cursor: not-allowed;
  }
`;

const MediaPreview = styled.div`
  margin-top: 10px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const PreviewImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: cover;
`;

const RemoveMedia = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
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
  overflow: hidden;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
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
  text-align: left;
`;

const PostImage = styled.img`
  width: 100%;
  max-height: 500px;
  object-fit: cover;
`;

const PostActions = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  padding: 10px 15px;
  border-top: 1px solid #e4e6eb;
`;

const ActionGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

const CountText = styled.span`
  font-size: 14px;
  color: #65676b;
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
  justify-content: flex-start;
  
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
  text-align: left;
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
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  
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
  
  const handleMediaSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedMedia(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeMedia = () => {
    setSelectedMedia(null);
    setMediaPreview(null);
  };
  
  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }
      
      // Update UI optimistically
      const updatedPosts = posts.map(post => {
        if (post.id_post === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likeCount: isLiked ? post.likeCount + 1 : post.likeCount - 1
          };
        }
        return post;
      });
      setPosts(updatedPosts);
      
      // Kirim request ke backend
      if (updatedPosts.find(post => post.id_post === postId)?.isLiked) {
        await axios.post('http://localhost:5000/api/likes', {
          id_post: postId
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.delete(`http://localhost:5000/api/likes/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (err) {
      console.error('Error liking post:', err);
      // Kembalikan ke state sebelumnya jika error
      setPosts(posts);
    }
  };
  
  const handleCreatePost = async () => {
    if (!newPostText.trim() && !selectedMedia) return;
    
    try {
      setIsPosting(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }
      
      const formData = new FormData();
      if (newPostText.trim()) {
        formData.append('caption', newPostText);
      }
      if (selectedMedia) {
        formData.append('media', selectedMedia);
      }
      
      await axios.post('http://localhost:5000/api/posts', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setNewPostText('');
      setSelectedMedia(null);
      setMediaPreview(null);
      fetchPosts();
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Gagal membuat post');
    } finally {
      setIsPosting(false);
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
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <div>
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
            <PostInputRow>
              <ProfilePic src={user?.foto_profil || "https://via.placeholder.com/40"} alt="Profile" />
              <PostInput 
                placeholder="Apa yang sedang Anda pikirkan?" 
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                rows={1}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
              />
            </PostInputRow>
            
            {mediaPreview && (
              <MediaPreview>
                <PreviewImage src={mediaPreview} alt="Preview" />
                <RemoveMedia onClick={removeMedia}>×</RemoveMedia>
              </MediaPreview>
            )}
            
            <CreatePostActions>
               <MediaButton>
                 📷 Foto/Video
                 <MediaUpload 
                   type="file" 
                   accept="image/*,video/*" 
                   onChange={handleMediaSelect}
                 />
               </MediaButton>
               
               <SubmitButton 
                 onClick={handleCreatePost}
                 disabled={(!newPostText.trim() && !selectedMedia) || isPosting}
               >
                 {isPosting ? 'Memposting...' : 'Posting'}
               </SubmitButton>
             </CreatePostActions>
          </CreatePostForm>
        </CreatePostCard>
        
        <FeedContainer>
          {posts.map(post => (
            <PostCard key={post.id_post}>
              <PostHeader>
                <PostUser>
                  <ProfilePic 
                    src={post.User?.foto_profil || "https://via.placeholder.com/40"} 
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
              
              <PostActions>
                <ActionGroup>
                  <CountText>{post.likeCount || 0} suka</CountText>
                  <ActionButton
                    active={post.isLiked}
                    onClick={() => handleLike(post.id_post)}
                  >
                    <ActionIcon>
                      {post.isLiked ? <FaHeart /> : <FaRegHeart />}
                    </ActionIcon>
                    Suka
                  </ActionButton>
                </ActionGroup>
                
                <ActionGroup>
                  <CountText>{post.commentCount || 0} komentar</CountText>
                  <ActionButton>
                    <ActionIcon>
                      <FaComment />
                    </ActionIcon>
                    Komentar
                  </ActionButton>
                </ActionGroup>
              </PostActions>
            </PostCard>
          ))}
        </FeedContainer>
      </ContentWrapper>
    </div>
  );
};

export default Beranda;
