import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LoginContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f0f0f0; /* Warna latar belakang ringan */
`;

const LeftContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px; /* Space below header */
`;

const Logo = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

const AppName = styled.h2`
  color: #333;
  font-size: 24px;
  font-weight: 700;
`;

const ImageContainer = styled.div`
  flex: 0.5;
  background-image: url('/src/assets/landing page animation.png');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
`;

const FormContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  flex-grow: 1; /* Memungkinkan FormContainer mengambil sisa ruang */
`;

const LoginCard = styled.div`
  width: 400px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  padding: 40px;
  backdrop-filter: blur(10px);
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 700;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 25px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: none;
  border-radius: 10px;
  background-color: #f0f0f0;
  font-size: 16px;
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 2px #a777e3;
    background-color: #fff;
  }
`;

const Icon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const PasswordToggle = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  cursor: pointer;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 15px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const ForgotPassword = styled.div`
  text-align: right;
  margin: 10px 0 20px;
  
  a {
    color: #6e8efb;
    text-decoration: none;
    font-size: 14px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Register = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
  
  a {
    color: #6e8efb;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', { // Ganti URL jika backend berjalan di tempat lain
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login berhasil:', data);
        // Simpan token dan data user ke localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect ke halaman beranda
        window.location.href = '/beranda';
      } else {
        console.error('Login gagal:', data.message);
        alert('Login gagal: ' + data.message);
      }
    } catch (error) {
      console.error('Terjadi kesalahan saat login:', error);
      // Tampilkan pesan error koneksi
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LoginContainer>
      <LeftContainer>
        <Header>
          <Logo src="/src/assets/Logo.png" alt="ConnectHub Logo" /> {/* Ganti dengan path logo Anda */}
          <AppName>ConnectHub</AppName>
        </Header>
        <FormContainer>
          <LoginCard>
            <Title>Masuk</Title>
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Icon>
                  <FaUser />
                </Icon>
                <Input
                  type="text"
                  name="email"
                  placeholder="Masukan email anda"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
              <InputGroup>
                <Icon>
                  <FaLock />
                </Icon>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Masukan kata sandi"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <PasswordToggle onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </PasswordToggle>
              </InputGroup>
              <ForgotPassword>
                <Link to="/forgot-password">Lupa kata sandi?</Link>
              </ForgotPassword>
              <Button type="submit">Log In</Button>
            </Form>
            <Register>
              Belum punya akun? <Link to="/register">Daftar</Link>
            </Register>
          </LoginCard>
        </FormContainer>
      </LeftContainer>
      <ImageContainer />
    </LoginContainer>
  );
};

export default Login;
