import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaCamera, FaSave, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: white;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 30px;
  overflow-y: auto;
`;

const SettingsSidebar = styled.div`
  width: 250px;
  background: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  padding: 20px;
  height: 100vh;
  overflow-y: auto;
`;

const SidebarTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  margin-bottom: 10px;
`;

const MenuLink = styled.button`
  width: 100%;
  text-align: left;
  background: ${props => props.active ? '#007bff' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  border: none;
  padding: 12px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? '#0056b3' : '#e9ecef'};
    color: ${props => props.active ? 'white' : '#333'};
  }
`;

const ProfileSection = styled.div`
  display: flex;
  gap: 30px;
  align-items: flex-start;
  margin-bottom: 30px;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 180px;
`;

const FormSection = styled.div`
  flex: 1;
  max-width: 600px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
`;

const Title = styled.h2`
  margin: 0;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CloseButton = styled.button`
  background: #f8f9fa;
  border: none;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e9ecef;
    color: #333;
  }
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-bottom: 15px;
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #007bff;
`;

const AvatarUpload = styled.label`
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: #007bff;
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
  border: 2px solid white;
  
  &:hover {
    background: #0056b3;
  }
`;

const UploadText = styled.p`
  margin-top: 15px;
  font-size: 14px;
  color: #666;
  text-align: center;
`;

const HiddenInput = styled.input`
  display: none;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
`;

const SaveButton = styled(Button)`
  background: #007bff;
  color: white;
  
  &:hover {
    background: #0056b3;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #6c757d;
  color: white;
  
  &:hover {
    background: #545b62;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
`;

const SuccessMessage = styled.div`
  color: #28a745;
  font-size: 14px;
  margin-top: 5px;
`;

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    foto_profil: null
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userData = response.data.data;
      setFormData({
        name: userData.name || '',
        username: userData.username || '',
        bio: userData.bio || '',
        foto_profil: null
      });
      
      // Set avatar preview langsung tanpa delay
      if (userData.foto_profil) {
        setAvatarPreview(`http://localhost:5000${userData.foto_profil}`);
      } else {
        setAvatarPreview('/src/assets/default-avatar.png');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Gagal memuat data profil');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        foto_profil: file
      }));
      
      // Preview gambar
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const submitData = new FormData();
      
      submitData.append('name', formData.name);
      submitData.append('username', formData.username);
      submitData.append('bio', formData.bio);
      
      if (formData.foto_profil) {
        submitData.append('foto_profil', formData.foto_profil);
      }

      const response = await axios.put('http://localhost:5000/api/users/profile', submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Profil berhasil diperbarui!');
      
      // Update localStorage dengan data user baru
      const updatedUser = response.data.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setTimeout(() => {
        navigate('/profil');
      }, 1500);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/profil');
  };

  return (
    <Container>
      <SettingsSidebar>
        <SidebarTitle>Pengaturan</SidebarTitle>
        <MenuList>
          <MenuItem>
            <MenuLink active={true}>
              Edit Profil
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink active={false}>
              Keamanan
            </MenuLink>
          </MenuItem>
        </MenuList>
      </SettingsSidebar>
      
      <MainContent>
        <Header>
          <Title>
            <FaUser /> Edit Profil
          </Title>
          <CloseButton onClick={handleCancel}>
            <FaTimes />
          </CloseButton>
        </Header>

        <ProfileSection>
          <LeftSection>
            <AvatarSection>
              <AvatarContainer>
                <Avatar 
                  src={avatarPreview || (formData.name ? `http://localhost:5000/uploads/profiles/default-avatar.png` : '/src/assets/default-avatar.png')} 
                  alt="Avatar"
                  onError={(e) => {
                    e.target.src = '/src/assets/default-avatar.png';
                  }}
                />
                <AvatarUpload htmlFor="avatar-upload">
                  <FaCamera />
                </AvatarUpload>
                <HiddenInput 
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </AvatarContainer>
              <UploadText>ubah foto profil</UploadText>
            </AvatarSection>
          </LeftSection>

          <FormSection>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Masukkan username"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="bio">Bio</Label>
                <TextArea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Ceritakan tentang diri Anda..."
                />
              </FormGroup>

              {error && <ErrorMessage>{error}</ErrorMessage>}
              {success && <SuccessMessage>{success}</SuccessMessage>}

              <ButtonGroup>
                <CancelButton type="button" onClick={handleCancel}>
                  <FaTimes /> Batal
                </CancelButton>
                <SaveButton type="submit" disabled={loading}>
                  <FaSave /> {loading ? 'Menyimpan...' : 'Simpan'}
                </SaveButton>
              </ButtonGroup>
            </Form>
          </FormSection>
        </ProfileSection>
      </MainContent>
    </Container>
  );
};

export default EditProfile;