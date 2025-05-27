import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import Beranda from './components/home/Beranda';
import Layout from './components/layout/Layout';
import ChatPage from './components/chat/ChatPage';

// Komponen untuk rute yang memerlukan autentikasi
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const currentPath = window.location.pathname;

    if (currentPath === '/login' || currentPath === '/register') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
    } else if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Bahkan jika logout API gagal, tetap hapus token dari frontend
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

          {/* Rute yang dilindungi */}
          <Route path="/beranda" element={
            <ProtectedRoute>
              <Layout onLogout={handleLogout}>
                <Beranda />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <Layout onLogout={handleLogout}>
                <ChatPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/chat/:id_penerima" element={
            <ProtectedRoute>
              <Layout onLogout={handleLogout}>
                <ChatPage />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Redirect ke beranda jika sudah login, ke login jika belum */}
          <Route path="/" element={
            isAuthenticated ?
            <Navigate to="/beranda" replace /> :
            <Navigate to="/login" replace />
          } />
        </Routes>
      </div>
  );
}

export default App;
