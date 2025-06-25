import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaTimes, FaSave, FaUser, FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';

// Styled Components
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
  padding: 20px 0 20px 20px;
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
  }
`;

const SidebarTitle = styled.h3`
  margin: 0 0 20px 0;
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
    gap: 10px;
    justify-content: center;
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
  background: ${props => props.$active ? '#2A8BF2' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#666'};
  border: none;
  padding: 12px 16px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: ${props => props.$active ? '#1a7bd9' : '#e9ecef'};
    color: ${props => props.$active ? 'white' : '#333'};
  }
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 12px;
    min-width: 100px;
    justify-content: center;
  }
`;

const SecuritySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px; /* Meningkatkan jarak antar section */
  align-items: flex-start;
  margin-bottom: 40px;
  padding: 30px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: #fafafa;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 20px;
    gap: 40px;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
    gap: 30px;
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
    gap: 15px;
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
    gap: 8px;
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
    padding: 6px;
  }
  
  @media (max-width: 480px) {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 16px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
  max-width: 600px; /* Lebar maksimum form input */
  margin: 0 auto; /* Posisi tengah */
  
  @media (max-width: 768px) {
    gap: 20px;
  }
  
  @media (max-width: 480px) {
    gap: 15px;
  }
`;

const FormSection = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px; /* Lebar maksimum form section */
  margin: 0 auto; /* Posisi tengah */
  
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
    border-radius: 6px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 10px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (max-width: 480px) {
    margin-bottom: 5px;
  }
`;

const Label = styled.label`
  font-weight: 500;
  margin-bottom: 6px;
  color: #555;
  font-size: 14px;
  
  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 5px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    margin-bottom: 4px;
  }
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 13px;
    border-radius: 5px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 12px;
    border-radius: 4px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  
  @media (max-width: 768px) {
    gap: 12px;
    margin-top: 20px;
    padding-top: 12px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
    margin-top: 15px;
    padding-top: 10px;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  min-width: 100px;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 13px;
    min-width: 80px;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 12px;
    min-width: 100%;
    border-radius: 18px;
  }
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
  background: #dc3545;
  color: white;
  
  &:hover {
    background: #c82333;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
  padding: 10px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  
  @media (max-width: 768px) {
    font-size: 13px;
    padding: 8px;
    margin-top: 4px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 6px;
    margin-top: 3px;
  }
`;

const SuccessMessage = styled.div`
  color: #28a745;
  font-size: 14px;
  margin-top: 5px;
  padding: 10px;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  
  @media (max-width: 768px) {
    font-size: 13px;
    padding: 8px;
    margin-top: 4px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 6px;
    margin-top: 3px;
  }
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
    navigate('/profil');
  };

  return (
    <Container>
      <SettingsSidebar>
        <SidebarTitle>Pengaturan</SidebarTitle>
        <MenuList>
          <MenuItem>
              <MenuLink onClick={() => navigate('/edit-profil')}>
                <FaUser /> Edit Profil
              </MenuLink>
            </MenuItem>
            <MenuItem>
              <MenuLink $active={true}>
                <FaShieldAlt /> Keamanan
              </MenuLink>
            </MenuItem>
        </MenuList>
      </SettingsSidebar>
      
      <MainContent>
        <Header>
          <Title>
            <FaShieldAlt /> Keamanan
          </Title>
          <CloseButton onClick={handleCancel}>
            <FaTimes />
          </CloseButton>
        </Header>

        <SecuritySection>
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
                <CancelButton type="button" onClick={handleCancel}>
                  <FaTimes /> Batal
                </CancelButton>
                <SaveButton type="submit" disabled={loading}>
                  <FaSave /> {loading ? 'Menyimpan...' : 'Simpan'}
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
                  <FaTimes /> Batal
                </CancelButton>
                <SaveButton type="submit" disabled={loading}>
                  <FaSave /> {loading ? 'Menyimpan...' : 'Simpan'}
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
