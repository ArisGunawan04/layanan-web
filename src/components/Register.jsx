import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterContainer = styled.div`
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
  background-image: url('/asset/landing page animation.png');
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

const RegisterCard = styled.div`
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

const LoginLink = styled.div`
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

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implementasi logika pendaftaran di sini
    console.log('Mendaftar dengan:', formData);
    // Tambahkan logika autentikasi di sini
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <RegisterContainer>
      <LeftContainer>
        <Header>
          <Logo src="/asset/logo.png" alt="ConnectHub Logo" /> {/* Ganti dengan path logo Anda */}
          <AppName>ConnectHub</AppName>
        </Header>
        <FormContainer>
          <RegisterCard>
            <Title>Daftar</Title>
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Icon>
                  <FaEnvelope />
                </Icon>
                <Input
                  type="email"
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
              <InputGroup>
                <Icon>
                  <FaLock />
                </Icon>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Konfirmasi kata sandi"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <PasswordToggle onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </PasswordToggle>
              </InputGroup>
              <InputGroup>
                <Icon>
                  <FaUser />
                </Icon>
                <Input
                  type="text"
                  name="username"
                  placeholder="Masukan nama pengguna"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
              <Button type="submit">Daftar</Button>
            </Form>
            <LoginLink>
              Sudah punya akun? <a href="#">Masuk</a>
            </LoginLink>
          </RegisterCard>
        </FormContainer>
      </LeftContainer>
      <ImageContainer />
    </RegisterContainer>
  );
};

export default Register;