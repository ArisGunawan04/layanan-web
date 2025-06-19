import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

// Styled Components
const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 40px);
  margin-left: 220px;
  background-color: #f8f9fa;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  max-width: calc(100vw - 470px);
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SettingsSidebar = styled.div`
  width: 250px;
  background-color: white;
  border-right: 1px solid #e9ecef;
  padding: 20px;
  min-height: calc(100vh - 40px);
`;

const SidebarTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  margin-bottom: 8px;
`;

const MenuLink = styled.div`
  display: block;
  padding: 12px 16px;
  color: ${props => props.active ? '#007bff' : '#666'};
  background-color: ${props => props.active ? '#f0f8ff' : 'transparent'};
  text-decoration: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8f9fa;
    color: #007bff;
  }
`;

const SecuritySection = styled.div`
  flex: 1;
  padding: 20px;
  max-width: 600px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8f9fa;
    color: #333;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormSection = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const CancelButton = styled(Button)`
  background-color: #f8f9fa;
  color: #666;
  
  &:hover {
    background-color: #e9ecef;
  }
`;

const SaveButton = styled(Button)`
  background-color: #007bff;
  color: white;
  
  &:hover {
    background-color: #0056b3;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #f5c6cb;
`;

const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #c3e6cb;
`;

const Security = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // State untuk ubah email
  const [emailData, setEmailData] = useState({
    newEmail: '',
    password: ''
  });
  
  // State untuk ubah password
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleEmailChange = (e) => {
    setEmailData({
      ...emailData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/security/change-email',
        emailData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccess('Email berhasil diubah!');
        setEmailData({ newEmail: '', password: '' });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Terjadi kesalahan saat mengubah email');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validasi password
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Password baru dan konfirmasi password tidak cocok');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password baru minimal 6 karakter');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/security/change-password',
        passwordData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccess('Password berhasil diubah!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Terjadi kesalahan saat mengubah password');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <Container>
      <MainContent>
        <SettingsSidebar>
          <SidebarTitle>Pengaturan</SidebarTitle>
          <MenuList>
            <MenuItem>
              <MenuLink onClick={() => navigate('/edit-profile')}>Edit Profil</MenuLink>
            </MenuItem>
            <MenuItem>
              <MenuLink active>Keamanan</MenuLink>
            </MenuItem>
          </MenuList>
        </SettingsSidebar>
        
        <SecuritySection>
          <Header>
            <Title>Keamanan</Title>
            <CloseButton onClick={handleCancel}>
              <FaTimes />
            </CloseButton>
          </Header>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          {/* Ubah Email Section */}
          <FormSection>
            <SectionTitle>Ubah Email</SectionTitle>
            <Form onSubmit={handleEmailSubmit}>
              <FormGroup>
                <Label htmlFor="newEmail">Email Baru</Label>
                <Input
                  type="email"
                  id="newEmail"
                  name="newEmail"
                  value={emailData.newEmail}
                  onChange={handleEmailChange}
                  placeholder="Masukkan email baru"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="emailPassword">Password</Label>
                <Input
                  type="password"
                  id="emailPassword"
                  name="password"
                  value={emailData.password}
                  onChange={handleEmailChange}
                  placeholder="Masukkan password untuk konfirmasi"
                  required
                />
              </FormGroup>
              <ButtonGroup>
                <SaveButton type="submit" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </SaveButton>
              </ButtonGroup>
            </Form>
          </FormSection>

          {/* Ubah Password Section */}
          <FormSection>
            <SectionTitle>Ubah Password</SectionTitle>
            <Form onSubmit={handlePasswordSubmit}>
              <FormGroup>
                <Label htmlFor="currentPassword">Password Lama</Label>
                <Input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Masukkan password lama"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="newPassword">Password Baru</Label>
                <Input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Masukkan password baru"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Konfirmasi password baru"
                  required
                />
              </FormGroup>
              <ButtonGroup>
                <CancelButton type="button" onClick={handleCancel}>
                  Batal
                </CancelButton>
                <SaveButton type="submit" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </SaveButton>
              </ButtonGroup>
            </Form>
          </FormSection>
        </SecuritySection>
      </MainContent>
    </Container>
  );
};

export default Security;