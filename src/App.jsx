import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Beranda from './components/home/Beranda';
import Layout from './components/layout/Layout';
import ChatPage from './components/chat/ChatPage';
import Notifikasi from './components/Notifikasi';
import Profile from './components/user/Profile';
import EditProfile from './components/user/EditProfile';
import Security from './components/user/Security';
import UserList from './components/user/UserList';

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
  
  useEffect(() => {
    // Cek apakah user sudah login
    const token = localStorage.getItem('token');
    
    // Jika URL adalah halaman login atau register, hapus token
    const currentPath = window.location.pathname;
    if (currentPath === '/login' || currentPath === '/register') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
    } else if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rute yang dilindungi */}
          <Route path="/beranda" element={
            <ProtectedRoute>
              <Layout>
                <Beranda />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <Layout>
                <ChatPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/chat/:id_penerima" element={
            <ProtectedRoute>
              <Layout>
                <ChatPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/pemberitahuan" element={
            <ProtectedRoute>
              <Layout>
                <Notifikasi />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/profil" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/profil/:userId" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/edit-profil" element={
            <ProtectedRoute>
              <Layout>
                <EditProfile />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/keamanan" element={
            <ProtectedRoute>
              <Layout>
                <Security />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <Layout>
                <UserList />
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
    </BrowserRouter>
  );
}

export default App;
