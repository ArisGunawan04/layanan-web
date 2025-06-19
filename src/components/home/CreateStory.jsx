import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTimes, FaCamera, FaVideo } from 'react-icons/fa';
import axios from 'axios';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 20px;
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
  padding: 8px;
  border-radius: 50%;
  
  &:hover {
    background-color: #f0f2f5;
  }
`;

const ModalBody = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const MediaUploadArea = styled.div`
  border: 2px dashed #e4e6eb;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4a6cf7;
    background-color: #f8f9ff;
  }
  
  ${props => props.hasMedia && `
    border: none;
    padding: 0;
    background: none;
  `}
`;

const UploadIcon = styled.div`
  font-size: 48px;
  color: #65676b;
  margin-bottom: 16px;
`;

const UploadText = styled.p`
  margin: 0;
  color: #65676b;
  font-size: 16px;
  font-weight: 500;
`;

const UploadSubtext = styled.p`
  margin: 8px 0 0 0;
  color: #8a8d91;
  font-size: 14px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const MediaPreview = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  max-height: 300px;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const PreviewVideo = styled.video`
  width: 100%;
  height: auto;
  display: block;
`;

const RemoveMediaButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const CaptionInput = styled.textarea`
  width: 100%;
  border: 1px solid #e4e6eb;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  resize: none;
  min-height: 80px;
  font-family: inherit;
  outline: none;
  
  &:focus {
    border-color: #4a6cf7;
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.2);
  }
  
  &::placeholder {
    color: #8a8d91;
  }
`;

const ModalFooter = styled.div`
  padding: 20px;
  border-top: 1px solid #e4e6eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  
  ${props => props.variant === 'primary' ? `
    background-color: #4a6cf7;
    color: white;
    
    &:hover {
      background-color: #3b5bdb;
    }
    
    &:disabled {
      background-color: #e4e6eb;
      color: #bcc0c4;
      cursor: not-allowed;
    }
  ` : `
    background-color: #f0f2f5;
    color: #65676b;
    
    &:hover {
      background-color: #e4e6eb;
    }
  `}
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const CreateStory = ({ isOpen, onClose, onStoryCreated }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleMediaSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedMedia(file);
      setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removeMedia = () => {
    setSelectedMedia(null);
    setMediaPreview(null);
    setMediaType(null);
  };

  const handleSubmit = async () => {
    if (!selectedMedia) {
      setError('Pilih media untuk story Anda');
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }

      const formData = new FormData();
      formData.append('media', selectedMedia);
      if (caption.trim()) {
        formData.append('caption', caption);
      }

      await axios.post('http://localhost:5000/api/stories', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Reset form
      setSelectedMedia(null);
      setMediaPreview(null);
      setMediaType(null);
      setCaption('');
      
      // Callback untuk refresh stories
      if (onStoryCreated) {
        onStoryCreated();
      }
      
      onClose();
    } catch (err) {
      console.error('Error creating story:', err);
      setError(err.response?.data?.message || 'Gagal membuat story');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedMedia(null);
      setMediaPreview(null);
      setMediaType(null);
      setCaption('');
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Buat Story</ModalTitle>
          <CloseButton onClick={handleClose} disabled={isUploading}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <MediaUploadArea 
            hasMedia={!!mediaPreview}
            onClick={() => !mediaPreview && document.getElementById('story-media-input').click()}
          >
            {mediaPreview ? (
              <MediaPreview>
                {mediaType === 'video' ? (
                  <PreviewVideo controls>
                    <source src={mediaPreview} type={selectedMedia.type} />
                  </PreviewVideo>
                ) : (
                  <PreviewImage src={mediaPreview} alt="Preview" />
                )}
                <RemoveMediaButton onClick={removeMedia}>
                  <FaTimes />
                </RemoveMediaButton>
              </MediaPreview>
            ) : (
              <>
                <UploadIcon>
                  <FaCamera />
                </UploadIcon>
                <UploadText>Tambahkan foto atau video</UploadText>
                <UploadSubtext>atau seret dan lepas</UploadSubtext>
              </>
            )}
          </MediaUploadArea>
          
          <HiddenInput
            id="story-media-input"
            type="file"
            accept="image/*,video/*"
            onChange={handleMediaSelect}
          />
          
          <CaptionInput
            placeholder="Tulis caption untuk story Anda..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={500}
          />
          
          {error && (
            <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '12px' }}>
              {error}
            </div>
          )}
        </ModalBody>
        
        <ModalFooter>
          <Button onClick={handleClose} disabled={isUploading}>
            Batal
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={!selectedMedia || isUploading}
          >
            {isUploading && <LoadingSpinner />}
            {isUploading ? 'Membuat...' : 'Bagikan Story'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreateStory;