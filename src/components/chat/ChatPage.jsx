import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../App.css';
import { useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const { id_penerima: initialRecipientId } = useParams();
  const messagesEndRef = useRef(null);
  const socket = useRef(null);
  
  // Fungsi untuk menentukan apakah pengguna online atau tidak
  const isUserOnline = (lastSeen) => {
    if (!lastSeen || lastSeen === null || lastSeen === undefined) {
      console.log('lastSeen tidak valid:', lastSeen);
      return false;
    }
    
    try {
      const lastSeenDate = new Date(lastSeen);
      const now = new Date();
      const diffInMinutes = (now - lastSeenDate) / (1000 * 60);
      
      console.log('User lastSeen:', lastSeen, 'diffInMinutes:', diffInMinutes);
      return diffInMinutes < 5; // Online jika terakhir aktif kurang dari 5 menit yang lalu
    } catch (error) {
      console.error('Error parsing lastSeen date:', error);
      return false;
    }
  };
  
  // Fungsi untuk mendapatkan teks status terakhir online
  const getLastSeenText = (lastSeen) => {
    if (!lastSeen || lastSeen === null || lastSeen === undefined) {
      console.log('lastSeen tidak valid untuk teks:', lastSeen);
      return 'Tidak diketahui';
    }
    
    try {
      return formatDistanceToNow(new Date(lastSeen), { 
        addSuffix: true,
        locale: id // Gunakan locale Indonesia
      });
    } catch (error) {
      console.error('Error formatting lastSeen date:', error);
      return 'Tidak diketahui';
    }
  };

  useEffect(() => {
    socket.current = io('http://localhost:5000'); // Sesuaikan dengan URL backend Anda

    socket.current.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);
  
  // Interval untuk memperbarui status online/offline setiap 30 detik
  useEffect(() => {
    const interval = setInterval(() => {
      // Memperbarui daftar pengguna untuk mendapatkan status terbaru
      const fetchUsers = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:5000/api/users', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUsers(response.data);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
      
      fetchUsers();
    }, 10000); // 10 detik
    
    return () => clearInterval(interval);
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
        // Log last_seen untuk debugging
        response.data.forEach(user => {
          console.log(`User ${user.username} last_seen:`, user.last_seen);
        });
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
    
    // Juga mengatur interval untuk memperbarui daftar pengguna setiap 30 detik
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
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
    if (selectedUser) {
      // Update selectedUser when users list is updated
      const updatedUser = users.find(u => u.user_id === selectedUser.user_id);
      if (updatedUser) {
        setSelectedUser(updatedUser);
      }
    }
  }, [users, selectedUser]);

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
                <div className="user-status-container">
                  <span>{user.username}</span>
                  <div className="user-status">
                    <span className="status-text">
                      {isUserOnline(user.last_seen) ? <span style={{ color: 'green' }}>sedang aktif</span> : `aktif ${getLastSeenText(user.last_seen)}`}
                    </span>
                  </div>
                </div>
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
              <div className="user-status-container">
                <h3>{selectedUser.username}</h3>
                <div className="user-status">
                  <span className="status-text">
                    {isUserOnline(selectedUser.last_seen) ? <span style={{ color: 'green' }}>sedang aktif</span> : `aktif ${getLastSeenText(selectedUser.last_seen)}`}
                  </span>
                </div>
              </div>
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