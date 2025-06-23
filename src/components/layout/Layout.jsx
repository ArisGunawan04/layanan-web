import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import { FaHome, FaEnvelope, FaBell, FaCompass, FaUser, FaPlus, FaSignOutAlt } from 'react-icons/fa';

const MainContent = styled.main`
  margin-left: 220px; /* Adjust this based on your sidebar width */
  padding: 20px;
  flex-grow: 1;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    padding: 0; /* Remove padding on mobile for full screen */
  }
`;

const MobileNavBar = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    background: #fff;
    border-top: 1px solid #e4e6eb;
    padding: 12px 20px 25px 20px;
    z-index: 9999;
    justify-content: space-around;
    align-items: center;
    height: 80px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8e8e93;
  font-size: 10px;
  cursor: pointer;
  min-width: 50px;
  gap: 4px;
  
  svg {
    width: 22px;
    height: 22px;
  }
  
  span {
    font-weight: 400;
    margin-top: 2px;
    text-align: center;
  }
  
  &.add-button {
    position: relative;
    top: -15px;
    
    span {
      display: none;
    }
  }
`;

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Hapus token dan data user dari localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect ke halaman login
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onLogout={handleLogout} />
      <MainContent>{children}</MainContent>
      
      {/* Mobile Navigation Bar */}
      <MobileNavBar>
        <NavItem onClick={() => navigate('/beranda')}>
          <FaHome />
          <span>Beranda</span>
        </NavItem>
        <NavItem onClick={() => navigate('/chat')}>
          <FaEnvelope />
          <span>Pesan</span>
        </NavItem>
        <NavItem onClick={() => navigate('/jelajahi')}>
          <FaCompass />
          <span>Jelajahi</span>
        </NavItem>
        <NavItem onClick={() => navigate('/pemberitahuan')}>
          <FaBell />
          <span>Notifikasi</span>
        </NavItem>
        <NavItem onClick={() => navigate('/profil')}>
          <FaUser />
          <span>Profil</span>
        </NavItem>
        <NavItem onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Keluar</span>
        </NavItem>
      </MobileNavBar>
    </div>
  );
};

export default Layout;
