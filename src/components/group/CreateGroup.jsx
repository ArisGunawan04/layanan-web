import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa'; // Import close icon

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
  &:hover {
    color: #f44336;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  &:focus {
    border-color: #4a6cf7;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  min-height: 120px;
  font-size: 16px;
  resize: vertical;
  &:focus {
    border-color: #4a6cf7;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #4a6cf7;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #3a5bd1;
  }
`;

const CreateGroup = ({ onClose, onGroupCreated }) => {
  const [namaGroup, setNamaGroup] = useState('');
  const [deskripsi, setDeskripsi] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/groups/create`, 
        { nama_group: namaGroup, deskripsi }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Grup berhasil dibuat!');
      onGroupCreated(); // Notify parent component
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Gagal membuat grup. Silakan coba lagi.');
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        <Title>Buat Grup Baru</Title>
        <Form onSubmit={handleSubmit}>
          <Input 
            type="text" 
            placeholder="Nama Grup" 
            value={namaGroup} 
            onChange={(e) => setNamaGroup(e.target.value)} 
            required 
          />
          <TextArea 
            placeholder="Deskripsi (opsional)" 
            value={deskripsi} 
            onChange={(e) => setDeskripsi(e.target.value)} 
          />
          <Button type="submit">Buat Grup</Button>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreateGroup;
