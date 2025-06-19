import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaChevronLeft, FaChevronRight, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const ViewerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ViewerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 400px;
  max-height: 700px;
  display: flex;
  flex-direction: column;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 100%;
    border-radius: 0;
  }
`;

const StoryHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 16px;
  background: linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%);
`;

const ProgressContainer = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: white;
  width: ${props => props.progress}%;
  transition: width 0.1s linear;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UserDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
`;

const UserName = styled.span`
  color: white;
  font-size: 14px;
  font-weight: 600;
`;

const StoryTime = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  margin-left: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const StoryContent = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StoryMedia = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StoryVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StoryCaption = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 16px;
  background: linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 100%);
  color: white;
  font-size: 14px;
  line-height: 1.4;
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
  
  ${props => props.direction === 'left' ? 'left: 16px;' : 'right: 16px;'}
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const TouchArea = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
  z-index: 3;
  
  ${props => props.side === 'left' ? 'left: 0;' : 'right: 0;'}
`;

const StoryViewer = ({ 
  isOpen, 
  onClose, 
  stories, 
  initialStoryIndex = 0, 
  initialUserIndex = 0,
  currentUser 
}) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentUserStories = stories[currentUserIndex];
  const currentStory = currentUserStories?.stories[currentStoryIndex];
  const isOwner = currentStory?.id_user === currentUser?.user_id;

  useEffect(() => {
    if (!isOpen || !currentStory) return;

    const duration = 5000; // 5 detik per story
    const interval = 50; // Update setiap 50ms
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      if (!isPaused) {
        setProgress(prev => {
          if (prev >= 100) {
            nextStory();
            return 0;
          }
          return prev + increment;
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [currentStory, isPaused, isOpen]);

  useEffect(() => {
    setProgress(0);
  }, [currentStoryIndex, currentUserIndex]);

  const nextStory = () => {
    if (currentStoryIndex < currentUserStories.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else if (currentUserIndex < stories.length - 1) {
      setCurrentUserIndex(prev => prev + 1);
      setCurrentStoryIndex(0);
    } else {
      onClose();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex(prev => prev - 1);
      const prevUserStories = stories[currentUserIndex - 1];
      setCurrentStoryIndex(prevUserStories.stories.length - 1);
    }
  };

  const deleteStory = async () => {
    if (!isOwner || !currentStory) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/stories/${currentStory.id_story}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove story from local state
      const updatedStories = [...stories];
      updatedStories[currentUserIndex].stories.splice(currentStoryIndex, 1);

      // If no more stories for this user, remove user
      if (updatedStories[currentUserIndex].stories.length === 0) {
        updatedStories.splice(currentUserIndex, 1);
        if (updatedStories.length === 0) {
          onClose();
          return;
        }
        if (currentUserIndex >= updatedStories.length) {
          setCurrentUserIndex(updatedStories.length - 1);
        }
        setCurrentStoryIndex(0);
      } else {
        // Adjust story index if needed
        if (currentStoryIndex >= updatedStories[currentUserIndex].stories.length) {
          setCurrentStoryIndex(updatedStories[currentUserIndex].stories.length - 1);
        }
      }
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const storyTime = new Date(timestamp);
    const diffInHours = Math.floor((now - storyTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - storyTime) / (1000 * 60));
      return `${diffInMinutes}m`;
    }
    return `${diffInHours}h`;
  };

  if (!isOpen || !currentStory) return null;

  return (
    <ViewerOverlay onClick={onClose}>
      <ViewerContainer onClick={(e) => e.stopPropagation()}>
        <StoryHeader>
          <ProgressContainer>
            {currentUserStories.stories.map((_, index) => (
              <ProgressBar key={index}>
                <ProgressFill 
                  progress={
                    index < currentStoryIndex ? 100 :
                    index === currentStoryIndex ? progress : 0
                  } 
                />
              </ProgressBar>
            ))}
          </ProgressContainer>
          
          <UserInfo>
            <UserDetails>
              <UserAvatar 
                src={currentUserStories.user.foto_profil ? 
                  `http://localhost:5000${currentUserStories.user.foto_profil}` : 
                  "/default-avatar.svg"
                } 
                alt={currentUserStories.user.name} 
              />
              <div>
                <UserName>{currentUserStories.user.name}</UserName>
                <StoryTime>{formatTime(currentStory.createdAt)}</StoryTime>
              </div>
            </UserDetails>
            
            <ActionButtons>
              {isOwner && (
                <ActionButton onClick={deleteStory}>
                  <FaTrash size={14} />
                </ActionButton>
              )}
              <ActionButton onClick={onClose}>
                <FaTimes size={14} />
              </ActionButton>
            </ActionButtons>
          </UserInfo>
        </StoryHeader>

        <StoryContent
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {currentStory.media.includes('.mp4') || currentStory.media.includes('.mov') ? (
            <StoryVideo 
              src={`http://localhost:5000${currentStory.media}`}
              autoPlay
              muted
              loop
            />
          ) : (
            <StoryMedia 
              src={`http://localhost:5000${currentStory.media}`}
              alt="Story"
            />
          )}
          
          {currentStory.caption && (
            <StoryCaption>
              {currentStory.caption}
            </StoryCaption>
          )}
          
          <TouchArea side="left" onClick={prevStory} />
          <TouchArea side="right" onClick={nextStory} />
        </StoryContent>

        {currentUserIndex > 0 && (
          <NavigationButton direction="left" onClick={prevStory}>
            <FaChevronLeft />
          </NavigationButton>
        )}
        
        {(currentStoryIndex < currentUserStories.stories.length - 1 || 
          currentUserIndex < stories.length - 1) && (
          <NavigationButton direction="right" onClick={nextStory}>
            <FaChevronRight />
          </NavigationButton>
        )}
      </ViewerContainer>
    </ViewerOverlay>
  );
};

export default StoryViewer;