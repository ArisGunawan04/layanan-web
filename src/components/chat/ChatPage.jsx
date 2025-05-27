import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../App.css';
import { useRef, useCallback } from 'react';
import io from 'socket.io-client';

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const { id_penerima: initialRecipientId } = useParams();
  const messagesEndRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('http://localhost:5000'); // Sesuaikan dengan URL backend Anda

    socket.current.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Mengambil token:', token);
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Respons pengguna:', response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        if (error.response) {
          console.error('Data error:', error.response.data);
          console.error('Status error:', error.response.status);
          console.error('Headers error:', error.response.headers);
        } else if (error.request) {
          console.error('Request error:', error.request);
        } else {
          console.error('Pesan error:', error.message);
        }
      }
    };

    fetchUsers();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  const fetchMessages = useCallback(async (recipientId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/chats/${recipientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, []);

  useEffect(() => {
    if (initialRecipientId) {
      const user = users.find(u => u.user_id === parseInt(initialRecipientId));
      if (user) {
        setSelectedUser(user);
        fetchMessages(user.user_id);
      }
    }
  }, [initialRecipientId, users, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchMessages(user.user_id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/chats/send',
        {
          id_penerima: selectedUser.user_id,
          pesan: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewMessage('');
      scrollToBottom();
      socket.current.emit('sendMessage', response.data.chat); // Kirim pesan melalui socket
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="sidebar-chat">
        <div className="chat-tabs">
          <div className="tab-item">permintaan</div>
          <div className="tab-item active">pesan</div>
          <div className="tab-item">grup</div>
        </div>
        <h2>Pengguna</h2>
        <ul>
          {console.log('Users state:', users)}
          {users.length > 0 ? (
            users.map((user) => (
              <li
                key={user.user_id}
                onClick={() => handleUserSelect(user)}
                className={selectedUser && selectedUser.user_id === user.user_id ? 'active' : ''}
              >
                <img src={user.foto_profil || 'https://via.placeholder.com/40'} alt={user.username} className="profile-pic" />
                <span>{user.username}</span>
              </li>
            ))
          ) : (
            <li>Tidak ada pengguna lain.</li>
          )}
        </ul>
      </div>
      <div className="chat-area">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <img src={selectedUser.foto_profil || 'https://via.placeholder.com/40'} alt={selectedUser.username} className="profile-pic" />
              <h3>{selectedUser.username}</h3>
            </div>
            <div className="messages">
              {messages.map((msg) => (
                <div
                  key={msg.id_chat}
                  className={`message ${msg.id_pengirim === selectedUser.user_id ? 'received' : 'sent'}`}
                >
                  <p>{msg.pesan}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ketik pesan di sini..."
              />
              <button type="submit">Kirim</button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">Pilih pengguna untuk memulai chat</div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;