import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaHeart, FaRegHeart, FaComment, FaEllipsisH, FaTimes } from 'react-icons/fa';
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
  position: relative;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  color: #65676b;
  
  &:hover {
    background-color: #f0f2f5;
  }
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #e4e6eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1c1e21;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #65676b;
  padding: 5px;
  border-radius: 50%;
  
  &:hover {
    background-color: #f0f2f5;
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 15px 20px;
`;

const ViewMoreButton = styled.button`
  background: none;
  border: none;
  color: #4a6cf7;
  font-weight: 600;
  cursor: pointer;
  padding: 5px 0;
  font-size: 14px;
  margin-top: 10px;
  
  &:hover {
    text-decoration: underline;
  }
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
  const [newCommentInput, setNewCommentInput] = useState({});
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [allComments, setAllComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [modalCommentInput, setModalCommentInput] = useState('');
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [loadingMoreComments, setLoadingMoreComments] = useState(false);
  
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
  
  const handleCommentChange = (postId, text) => {
    setNewCommentInput(prev => ({
      ...prev,
      [postId]: text
    }));
  };
  
  const submitComment = async (postId) => {
    const commentText = newCommentInput[postId]?.trim();
    if (!commentText) return;
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }
  
      await axios.post(
        `http://localhost:5000/api/comments/post/${postId}`,
        { isi_komentar: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      // Reset input
      setNewCommentInput(prev => ({
        ...prev,
        [postId]: ''
      }));
  
      // Refresh posts untuk menampilkan komentar baru
      fetchPosts();
  
    } catch (err) {
      console.error('Error submitting comment:', err);
      setError('Gagal mengirim komentar');
    }
  };

  const openCommentsModal = async (postId) => {
    setSelectedPostId(postId);
    setShowCommentsModal(true);
    setLoadingComments(true);
    setCommentPage(1);
    
    try {
      const response = await axios.get(`http://localhost:5000/api/comments/post/${postId}`);
      setAllComments(response.data.data || []);
      setHasMoreComments(response.data.currentPage < response.data.totalPages);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Gagal mengambil komentar');
    } finally {
      setLoadingComments(false);
    }
  };

  const loadMoreComments = async () => {
    if (!selectedPostId || loadingMoreComments) return;
    
    setLoadingMoreComments(true);
    const nextPage = commentPage + 1;
    
    try {
      const response = await axios.get(`http://localhost:5000/api/comments/post/${selectedPostId}?page=${nextPage}&limit=10`);
      setAllComments(prev => [...prev, ...(response.data.data || [])]);
      setCommentPage(nextPage);
      setHasMoreComments(response.data.currentPage < response.data.totalPages);
    } catch (err) {
      console.error('Error loading more comments:', err);
      setError('Gagal memuat komentar tambahan');
    } finally {
      setLoadingMoreComments(false);
    }
  };

  const closeCommentsModal = () => {
    setShowCommentsModal(false);
    setSelectedPostId(null);
    setAllComments([]);
    setModalCommentInput('');
    setCommentPage(1);
    setHasMoreComments(false);
  };

  const submitModalComment = async () => {
    if (!modalCommentInput.trim() || !selectedPostId) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }

      await axios.post(
        `http://localhost:5000/api/comments/post/${selectedPostId}`,
        { isi_komentar: modalCommentInput },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setModalCommentInput(''); // Clear input
      // Refresh komentar di modal
      await openCommentsModal(selectedPostId);
      // Refresh posts untuk update counter
      fetchPosts();
    } catch (err) {
      console.error('Error submitting comment:', err);
      setError('Gagal mengirim komentar');
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
              <ProfilePic src={user?.foto_profil ? `http://localhost:5000${user.foto_profil}` : "https://via.placeholder.com/40"} alt="Profile" />
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
                    src={post.User?.foto_profil ? `http://localhost:5000${post.User.foto_profil}` : "https://via.placeholder.com/40"} 
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

              {/* Komentar Section */}
              <div style={{ padding: '0 15px 15px', borderTop: '1px solid #e4e6eb' }}>
                {/* Daftar Komentar Preview (hanya 2 komentar) */}
                {post.Komentars?.slice(0, 2).map((comment, index) => (
                  <div key={index} style={{ display: 'flex', marginTop: '10px' }}>
                    <img
                      src={comment.User?.foto_profil ? `http://localhost:5000${comment.User.foto_profil}` : "https://via.placeholder.com/30"}
                      alt={comment.User?.name}
                      style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ background: '#f0f2f5', borderRadius: '18px', padding: '8px 12px' }}>
                        <div style={{ fontWeight: '600', fontSize: '13px', textAlign: 'left' }}>{comment.User?.name}</div>
                        <div style={{ fontSize: '14px', textAlign: 'left' }}>{comment.isi_komentar}</div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#65676b', marginTop: '4px', marginLeft: '12px' }}>
                        {formatTime(comment.waktu)}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Tombol Lihat Semua Komentar */}
                {post.commentCount > 2 && (
                  <ViewMoreButton onClick={() => openCommentsModal(post.id_post)}>
                    Lihat semua {post.commentCount} komentar
                  </ViewMoreButton>
                )}

                {/* Input Komentar Baru */}
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                  <img
                    src={user?.foto_profil ? `http://localhost:5000${user.foto_profil}` : "https://via.placeholder.com/30"}
                    alt="Profile"
                    style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}
                  />
                  <div style={{ flex: 1, position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="Tulis komentar..."
                      value={newCommentInput[post.id_post] || ''}
                      onChange={(e) => handleCommentChange(post.id_post, e.target.value)}
                      style={{
                        width: '100%',
                        border: '1px solid #e4e6eb',
                        borderRadius: '20px',
                        padding: '8px 12px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <button
                    onClick={() => submitComment(post.id_post)}
                    disabled={!newCommentInput[post.id_post]?.trim()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4a6cf7',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginLeft: '10px',
                      opacity: newCommentInput[post.id_post]?.trim() ? 1 : 0.5
                    }}
                  >
                    Kirim
                  </button>
                </div>
              </div>
            </PostCard>
          ))}
        </FeedContainer>
      </ContentWrapper>

      {/* Modal Komentar */}
      {showCommentsModal && (
        <ModalOverlay onClick={closeCommentsModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Komentar</ModalTitle>
              <CloseButton onClick={closeCommentsModal}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <ModalBody 
              onScroll={(e) => {
                const { scrollTop, scrollHeight, clientHeight } = e.target;
                if (scrollHeight - scrollTop === clientHeight && hasMoreComments && !loadingMoreComments) {
                  loadMoreComments();
                }
              }}
              style={{ maxHeight: '400px', overflowY: 'auto' }}
            >
              {loadingComments ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>Memuat komentar...</div>
              ) : (
                <>
                  {/* Daftar Semua Komentar */}
                  {allComments.map((comment, index) => (
                    <div key={index} style={{ display: 'flex', marginBottom: '15px' }}>
                      <img
                        src={comment.User?.foto_profil ? `http://localhost:5000${comment.User.foto_profil}` : "https://via.placeholder.com/40"}
                        alt={comment.User?.name}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '12px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ background: '#f0f2f5', borderRadius: '18px', padding: '10px 15px' }}>
                          <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px', textAlign: 'left' }}>
                            {comment.User?.name}
                          </div>
                          <div style={{ fontSize: '14px', lineHeight: '1.4', textAlign: 'left' }}>
                            {comment.isi_komentar}
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', color: '#65676b', marginTop: '5px', marginLeft: '15px' }}>
                          {formatTime(comment.waktu)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {allComments.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#65676b', padding: '20px' }}>
                      Belum ada komentar
                    </div>
                  )}
                  
                  {/* Loading indicator untuk infinite scroll */}
                  {loadingMoreComments && (
                    <div style={{ textAlign: 'center', padding: '15px 0', color: '#65676b', fontSize: '14px' }}>
                      Memuat komentar...
                    </div>
                  )}
                </>
              )}
            </ModalBody>
            
            {/* Input Komentar di Modal */}
            <div style={{ padding: '15px 20px', borderTop: '1px solid #e4e6eb' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={user?.foto_profil ? `http://localhost:5000${user.foto_profil}` : "https://via.placeholder.com/35"}
                  alt="Profile"
                  style={{ width: '35px', height: '35px', borderRadius: '50%', marginRight: '10px' }}
                />
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Tulis komentar..."
                    value={modalCommentInput}
                    onChange={(e) => setModalCommentInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && submitModalComment()}
                    style={{
                      width: '100%',
                      border: '1px solid #e4e6eb',
                      borderRadius: '20px',
                      padding: '10px 15px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <button
                  onClick={submitModalComment}
                  disabled={!modalCommentInput.trim()}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4a6cf7',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginLeft: '10px',
                    opacity: modalCommentInput.trim() ? 1 : 0.5
                  }}
                >
                  Kirim
                </button>
              </div>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default Beranda;
