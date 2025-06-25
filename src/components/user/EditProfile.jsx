import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaCamera, FaSave, FaTimes, FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 40px);
  background: white;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 30px;
  overflow-y: auto;
  max-width: calc(100% - 200px);
  
  @media (max-width: 768px) {
    max-width: 100%;
    padding: 15px;
  }
`;



const SettingsSidebar = styled.div`
  width: 200px;
  background: white;
  padding: 20px 0;
  min-height: calc(100vh - 40px);
  overflow-y: auto;
  position: sticky;
  top: 0;
  border-right: 1px solid #e0e0e0;
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 15px;
    min-height: auto;
    position: relative;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: center;
    gap: 20px;
  }
`;

const SidebarTitle = styled.h3`
  margin: 0 0 20px 20px;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  @media (max-width: 768px) {
    display: flex;
    gap: 20px;
  }
`;

const MenuItem = styled.li`
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    margin-bottom: 0;
  }
`;

const MenuLink = styled.button`
  width: 100%;
  text-align: left;
  background: ${props => props.$active ? '#007bff' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#666'};
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 20px;
  
  &:hover {
    background: ${props => props.$active ? '#0056b3' : '#f8f9fa'};
    color: ${props => props.$active ? 'white' : '#333'};
  }
  
  @media (max-width: 768px) {
    margin: 0;
    padding: 10px 20px;
    border-radius: 20px;
    justify-content: center;
    min-width: 120px;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  gap: 40px;
  align-items: flex-start;
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: #fafafa;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    padding: 15px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    gap: 15px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 200px;
  
  @media (max-width: 768px) {
    min-width: 100%;
    align-items: center;
  }
`;

const FormSection = styled.div`
  flex: 1;
  max-width: 500px;
  
  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #2A8BF2;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
    padding-bottom: 15px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
`;

const Title = styled.h2`
  margin: 0;
  color: #007bff;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 18px;
    justify-content: center;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
    color: #333;
  }
  
  @media (max-width: 768px) {
    font-size: 18px;
    padding: 10px;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
    padding: 12px;
    position: absolute;
    top: 10px;
    right: 10px;
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
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #2A8BF2;
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
  
  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }
`;

const AvatarUpload = styled.label`
  position: absolute;
  bottom: 0px;
  right: 0px;
  background: #007bff;
  color: white;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
  border: 2px solid white;
  
  &:hover {
    background: #0056b3;
  }
  
  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    font-size: 12px;
  }
  
  @media (max-width: 480px) {
    width: 25px;
    height: 25px;
    font-size: 10px;
  }
`;

const UploadText = styled.p`
  margin-top: 10px;
  font-size: 12px;
  color: #007bff;
  text-align: center;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 13px;
    margin-top: 8px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
    margin-top: 6px;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  @media (max-width: 768px) {
    gap: 18px;
  }
  
  @media (max-width: 480px) {
    gap: 16px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    margin-bottom: 5px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 8px;
  }
`;

const Label = styled.label`
  font-weight: 500;
  margin-bottom: 6px;
  color: #555;
  font-size: 14px;
  
  @media (max-width: 768px) {
    font-size: 15px;
    margin-bottom: 8px;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: 600;
  }
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  background: white;
  width: 100%;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 14px 16px;
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
    font-size: 16px;
    border-radius: 8px;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: border-color 0.2s ease;
  background: white;
  width: 100%;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 14px 16px;
    font-size: 16px;
    min-height: 100px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
    font-size: 16px;
    border-radius: 8px;
    min-height: 120px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 25px;
  
  @media (max-width: 768px) {
    justify-content: center;
    margin-top: 20px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  min-width: 100px;
  
  @media (max-width: 768px) {
    padding: 12px 24px;
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 14px 20px;
    font-size: 16px;
  }
`;

const SaveButton = styled(Button)`
  background: #007bff;
  color: white;
  border-radius: 25px;
  
  &:hover {
    background: #0056b3;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #dc3545;
  color: white;
  border-radius: 25px;
  
  &:hover {
    background: #c82333;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
  
  @media (max-width: 768px) {
    font-size: 15px;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
    padding: 10px;
    background: #f8d7da;
    border-radius: 6px;
    border: 1px solid #f5c6cb;
  }
`;

const SuccessMessage = styled.div`
  color: #28a745;
  font-size: 14px;
  margin-top: 5px;
  
  @media (max-width: 768px) {
    font-size: 15px;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
    padding: 10px;
    background: #d4edda;
    border-radius: 6px;
    border: 1px solid #c3e6cb;
  }
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
        setAvatarPreview('/default-avatar.svg');
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
            <MenuLink $active={true}>
              <FaUser /> Edit Profil
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink onClick={() => navigate('/keamanan')}>
              <FaShieldAlt /> Keamanan
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
                  src={avatarPreview || '/default-avatar.svg'}
                  alt="Avatar"
                  onError={(e) => {
                    e.target.src = '/default-avatar.svg';
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
              <UploadText>pilih file</UploadText>
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
                <Label htmlFor="username">username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="David_user"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="bio">bio</Label>
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