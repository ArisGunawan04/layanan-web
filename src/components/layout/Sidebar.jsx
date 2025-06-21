import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaHome, FaComment, FaBell, FaUser, FaSignOutAlt, FaUsers, FaLayerGroup, FaSearch } from 'react-icons/fa';

const SidebarContainer = styled.div`
  width: 220px;
  height: 100vh;
  background-color: #fff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  margin-bottom: 20px;
`;

const LogoImage = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

const LogoText = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: #4a6cf7;
`;

const NavMenu = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: #666;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f5f8ff;
    color: #4a6cf7;
  }
  
  &.active {
    background-color: #f5f8ff;
    color: #4a6cf7;
    border-left: 3px solid #4a6cf7;
  }
`;

const NavIcon = styled.div`
  margin-right: 15px;
  font-size: 20px;
  display: flex;
  align-items: center;
`;

const NavText = styled.span`
  font-size: 16px;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  margin: 20px;
  background: none;
  border: none;
  color: #666;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: #f44336;
  }
`;

const LogoutIcon = styled.div`
  margin-right: 15px;
  font-size: 20px;
  display: flex;
  align-items: center;
`;

const Sidebar = ({ onLogout }) => {
  return (
    <SidebarContainer>
      <Logo>
        <LogoImage src="/src/assets/Logo.png" alt="ConnectHub Logo" />
        <LogoText>ConnectHub</LogoText>
      </Logo>
      
      <NavMenu>
        <NavItem to="/beranda" activeclassname="active">
          <NavIcon><FaHome /></NavIcon>
          <NavText>Beranda</NavText>
        </NavItem>
        
        <NavItem to="/chat" activeclassname="active">
          <NavIcon><FaComment /></NavIcon>
          <NavText>Pesan</NavText>
        </NavItem>
        
        <NavItem to="/pemberitahuan" activeclassname="active">
          <NavIcon><FaBell /></NavIcon>
          <NavText>Pemberitahuan</NavText>
        </NavItem>
        
        <NavItem to="/jelajahi" activeclassname="active">
          <NavIcon><FaSearch /></NavIcon>
          <NavText>Jelajahi</NavText>
        </NavItem>
        
        <NavItem to="/profil" activeclassname="active">
          <NavIcon><FaUser /></NavIcon>
          <NavText>Profil</NavText>
        </NavItem>
      </NavMenu>
      
      <LogoutButton onClick={onLogout}>
        <LogoutIcon><FaSignOutAlt /></LogoutIcon>
        <span>LOG OUT</span>
      </LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;
