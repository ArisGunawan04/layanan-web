import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ children, onLogout }) => {
  return (
    <div>
      <Sidebar onLogout={onLogout} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
