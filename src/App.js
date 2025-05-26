import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Beranda from './components/home/Beranda';
import Layout from './components/layout/Layout';

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
