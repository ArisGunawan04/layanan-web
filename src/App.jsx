import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import NotificationToast from './components/notifications/NotificationToast';
import Login from './components/Login';
import Register from './components/Register';
import Beranda from './components/home/Beranda';
import Layout from './components/layout/Layout';
import ChatPage from './components/chat/ChatPage';
import Notifikasi from './components/Notifikasi';
import Profile from './components/user/Profile';
import EditProfile from './components/user/EditProfile';
import Security from './components/user/Security';
import GroupList from './components/group/GroupList';
import CreateGroup from './components/group/CreateGroup';
import GroupDetail from './components/group/GroupDetail';
import Jelajahi from './components/explore/Jelajahi';

// Komponen untuk rute yang memerlukan autentikasi
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Komponen untuk konten yang memerlukan NotificationContext
const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toastNotifications, removeToastNotification, handleNotificationClick } = useNotification();
  
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
          <Route path="/jelajahi" element={
            <ProtectedRoute>
              <Layout>
                <Jelajahi />
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
          <Route path="/groups" element={
            <ProtectedRoute>
              <Layout>
                <GroupList />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/groups/create" element={
            <ProtectedRoute>
              <Layout>
                <CreateGroup />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/groups/:id_group" element={
            <ProtectedRoute>
              <Layout>
                <GroupDetail />
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
        
        {/* Toast Notifications */}
        <NotificationToast 
          notifications={toastNotifications}
          onClose={removeToastNotification}
          onToastClick={handleNotificationClick}
        />
      </div>
    );
  };

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
