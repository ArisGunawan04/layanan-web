import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

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
    <div>
      <Sidebar onLogout={handleLogout} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
