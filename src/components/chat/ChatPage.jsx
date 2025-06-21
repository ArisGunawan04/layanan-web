import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../App.css';
import io from 'socket.io-client';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { FaEllipsisV, FaTrash, FaBan } from 'react-icons/fa';

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showFilePopup, setShowFilePopup] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [showMediaPreview, setShowMediaPreview] = useState(false);
  const [previewMediaUrl, setPreviewMediaUrl] = useState('');
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [previewMediaType, setPreviewMediaType] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState('');
  const [confirmModalAction, setConfirmModalAction] = useState(null);
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
    }, 30000); // 10 detik
    
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
    
    // Close chat menu when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.chat-menu-container')) {
        setShowChatMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    
    // Juga mengatur interval untuk memperbarui daftar pengguna setiap 30 detik
    const interval = setInterval(fetchUsers, 30000);
    return () => {
      clearInterval(interval);
      document.removeEventListener('click', handleClickOutside);
    };
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

  const handleDeleteChat = async () => {
    if (!selectedUser) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/chats/delete-chat/${selectedUser.user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Update UI dengan mengosongkan pesan
      setMessages([]);
      setShowChatMenu(false);
      setShowConfirmModal(false);
      
      // Tampilkan notifikasi sukses
      alert('Percakapan berhasil dihapus');
    } catch (error) {
      console.error('Gagal menghapus chat:', error);
      let errorMessage = 'Gagal menghapus percakapan. Silakan coba lagi.';
      if (error.response) {
        // Server merespons dengan status error
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // Permintaan dikirim tapi tidak ada respons
        errorMessage = 'Tidak ada respons dari server. Periksa koneksi internet Anda.';
      }
      alert(errorMessage);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !selectedUser) return;

    try {
      const token = localStorage.getItem('token');
      let response;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('id_penerima', selectedUser.user_id);
        formData.append('pesan', newMessage);
        formData.append('file', selectedFile);

        response = await axios.post(
          'http://localhost:5000/api/chats/send-file',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        response = await axios.post(
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
      }

      setNewMessage('');
      if (selectedFile) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
        setSelectedFile(null);
      }
      scrollToBottom();
      if (response.data.chat) {
        socket.current.emit('sendMessage', response.data.chat);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleAttachmentClick = () => {
    setShowAttachmentMenu(!showAttachmentMenu);
  };

  const handleFileUpload = (type) => {
    if (type === 'image') {
      setSelectedFileType('media');
      setShowFilePopup(true);
      setShowAttachmentMenu(false);
    } else if (type === 'document') {
      setSelectedFileType('document');
      setShowFilePopup(true);
      setShowAttachmentMenu(false);
    }
  };

  const handleFileSelect = (fileType) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    
    switch(fileType) {
      case 'media':
        fileInput.accept = 'image/*,video/*,.mkv';
        break;
      case 'document':
        fileInput.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt';
        break;
      case 'image':
        fileInput.accept = 'image/*';
        break;
      case 'video':
        fileInput.accept = 'video/*,.mkv';
        break;
      case 'audio':
        fileInput.accept = 'audio/*';
        break;
      default:
        fileInput.accept = '*/*';
    }
    
    fileInput.click();
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        console.log(`File dipilih: ${file.name}, tipe: ${fileType}`);
        setSelectedFile(file);
        // Buat URL untuk preview hanya untuk gambar
        if (file.type.startsWith('image/')) {
          const fileUrl = URL.createObjectURL(file);
          setPreviewUrl(fileUrl);
        } else {
          setPreviewUrl('');
        }
      }
    };
  };
  
  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
   
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
                <img 
                  src={user.foto_profil ? `http://localhost:5000${user.foto_profil}` : '/default-avatar.svg'} 
                  alt={user.username} 
                  className="profile-pic"
                  onError={(e) => {
                    e.target.src = '/default-avatar.svg';
                  }}
                />
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
              <img 
                  src={selectedUser.foto_profil ? `http://localhost:5000${selectedUser.foto_profil}` : '/default-avatar.svg'} 
                  alt={selectedUser.username} 
                  className="profile-pic"
                  onError={(e) => {
                    e.target.src = '/default-avatar.svg';
                  }}
                />
              <div className="user-status-container">
                <h3>{selectedUser.username}</h3>
                <div className="user-status">
                  <span className="status-text">
                    {isUserOnline(selectedUser.last_seen) ? <span style={{ color: 'green' }}>sedang aktif</span> : `aktif ${getLastSeenText(selectedUser.last_seen)}`}
                  </span>
                </div>
              </div>
              <div className="chat-menu-container">
                <button 
                  className="chat-menu-button"
                  onClick={() => setShowChatMenu(!showChatMenu)}
                >
                  <FaEllipsisV />
                </button>
                {showChatMenu && (
                   <div className="chat-dropdown-menu">
                     <button 
                       className="menu-item delete-chat"
                       onClick={() => {
                         setConfirmModalMessage('Apakah Anda yakin ingin menghapus semua pesan dalam chat ini?');
                         setConfirmModalAction(() => () => {
                           handleDeleteChat();
                         });
                         setShowConfirmModal(true);
                         setShowChatMenu(false);
                       }}
                     >
                       <FaTrash /> Hapus Chat
                     </button>
                     <button
                       className="menu-item block-user"
                       onClick={() => {
                         setConfirmModalMessage(`Apakah Anda yakin ingin memblokir ${selectedUser.username}?`);
                         setConfirmModalAction(() => () => {
                           // TODO: Implement block user functionality
                           console.log('Block user:', selectedUser.username);
                           setShowChatMenu(false);
                           setShowConfirmModal(false);
                         });
                         setShowConfirmModal(true);
                         setShowChatMenu(false);
                       }}
                     >
                       <FaBan /> Blokir Pengguna
                     </button>
                   </div>
                 )}
              </div>
            </div>
            <div className="messages">
              {messages.map((msg) => (
                <div
                  key={msg.id_chat}
                  className={`message ${msg.id_pengirim === selectedUser.user_id ? 'received' : 'sent'}`}
                >
                  {msg.media_url ? (
                    <div className="message-media">
                      {(() => {
                        const fileName = msg.media_url.split('/').pop();
                        const fileExt = fileName.split('.').pop().toLowerCase();
                        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(fileExt);
                        const isVideo = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(fileExt);

                        if (isImage) {
                          return (
                            <img
                              src={`http://localhost:5000${msg.media_url}`}
                              alt="Sent media"
                              className="message-image"
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                setPreviewMediaUrl(`http://localhost:5000${msg.media_url}`);
                                setPreviewMediaType('image');
                                setShowMediaPreview(true);
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                const errorDiv = document.createElement('div');
                                errorDiv.innerHTML = `<div style="padding: 10px; background: #f0f0f0; border-radius: 4px; color: #666;">❌ Gambar tidak dapat dimuat<br><small>${fileName}</small></div>`;
                                e.target.parentNode.appendChild(errorDiv);
                              }}
                            />
                          );
                        } else if (isVideo) {
                          return (
                            <div style={{ position: 'relative', cursor: 'pointer' }}
                              onClick={() => {
                                setPreviewMediaUrl(`http://localhost:5000${msg.media_url}`);
                                setPreviewMediaType('video');
                                setShowMediaPreview(true);
                              }}
                            >
                              <video
                                src={`http://localhost:5000${msg.media_url}`}
                                className="message-video"
                                style={{ borderRadius: '8px', objectFit: 'cover', pointerEvents: 'none' }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  const errorDiv = document.createElement('div');
                                  errorDiv.innerHTML = `<div style="padding: 10px; background: #f0f0f0; border-radius: 4px; color: #666;">❌ Video tidak dapat dimuat<br><small>${fileName}</small></div>`;
                                  e.target.parentNode.appendChild(errorDiv);
                                }}
                              />
                              <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '16px'
                              }}>
                                ▶
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div className="document-file" style={{
                              padding: '10px',
                              border: '1px solid #ddd',
                              borderRadius: '8px',
                              backgroundColor: '#f9f9f9',
                              cursor: 'pointer'
                            }} onClick={() => window.open(`http://localhost:5000${msg.media_url}`, '_blank')}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '20px' }}>📄</span>
                                <div>
                                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>{fileName}</div>
                                  <div style={{ fontSize: '12px', color: '#666' }}>Klik untuk membuka</div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })()}
                      {msg.pesan && <p className="message-caption">{msg.pesan}</p>}
                    </div>
                  ) : (
                    <p>{msg.pesan}</p>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            {showFilePopup && (
              <div className="attachment-popup-overlay" onClick={() => setShowFilePopup(false)}>
                <div className="attachment-popup-content" onClick={(e) => e.stopPropagation()}>
                  <div className="attachment-popup-header">
                    <h3>{selectedFileType === 'media' ? 'Masukan Foto/Video' : 'Masukan Dokumen'}</h3>
                    <button 
                      className="attachment-popup-close"
                      onClick={() => setShowFilePopup(false)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="attachment-popup-options">
                    {selectedFileType === 'document' && (
                      <div 
                        className="attachment-popup-option"
                        onClick={() => handleFileSelect('document')}
                      >
                        <div className="attachment-popup-icon document">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className="attachment-popup-text">
                          <h4>Masukan Dokumen</h4>
                          <p>PDF, DOC, TXT</p>
                        </div>
                      </div>
                    )}
                    {selectedFileType === 'media' && (
                      <div 
                        className="attachment-popup-option"
                        onClick={() => handleFileSelect('media')}
                      >
                        <div className="attachment-popup-icon media">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                            <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className="attachment-popup-text">
                          <h4>Masukan Foto/Video</h4>
                          <p>JPG, PNG, MP4, AVI</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Attachment dan preview file dalam satu baris */}
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 12 }}>
              {/* Attachment button dan menu dihapus sesuai permintaan */}
              <div style={{ width: 0, height: 0 }}></div>
              {(previewUrl || selectedFile) && (
  <div className="file-preview" style={{ marginLeft: 64, position: 'relative', display: 'inline-block', maxWidth: 180 }}>
    {/* Tombol X di luar gambar/file */}
    <button
      type="button"
      onClick={() => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl('');
        }
        setSelectedFile(null);
      }}
      style={{
        position: 'absolute',
        top: -18,
        right: -18,
        background: 'transparent',
        color: '#e53935',
        border: 'none',
        borderRadius: 0,
        width: 24,
        height: 24,
        fontSize: 22,
        fontWeight: 'bold',
        lineHeight: 1,
        cursor: 'pointer',
        zIndex: 3,
        padding: 0,
        boxShadow: 'none',
      }}
      aria-label="Hapus preview"
      title="Hapus preview"
    >
      ×
    </button>
    {previewUrl ? (
      <img src={previewUrl} alt="Preview" style={{ maxWidth: '160px', maxHeight: '160px', borderRadius: 8 }} />
    ) : selectedFile ? (
      <div style={{ 
        padding: '14px', 
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        backgroundColor: '#f5f5f5',
        maxWidth: '240px',
        minWidth: '140px',
        minHeight: '90px',
        position: 'relative'
      }}>
        <div style={{ fontSize: '12px', color: '#666', wordBreak: 'break-all' }}>📄 {selectedFile.name}</div>
        <div style={{ fontSize: '10px', color: '#999' }}>{(selectedFile.size / 1024).toFixed(1)} KB</div>
      </div>
    ) : null}
  </div>
)}
            </div>
            <form onSubmit={handleSendMessage} className="message-input">
              <div className="attachment-container">
                <button 
                  type="button" 
                  className="attachment-button"
                  onClick={handleAttachmentClick}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4V20M4 12H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {showAttachmentMenu && (
                  <div className="attachment-menu">
                    <div className="attachment-item" onClick={() => handleFileUpload('image')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM13.96 12.29L11.21 15.83L9.25 13.47L6.5 17H17.5L13.96 12.29Z" fill="white"/>
                      </svg>
                    </div>
                    <div className="attachment-item" onClick={() => handleFileUpload('document')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="white"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ketik pesan di sini..."
              />
              <button 
                type="submit" 
                style={{
                  background: '#2A8BF2',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                  marginLeft: '8px'
                }}
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M22 2L11 13" 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M22 2L15 22L11 13L2 9L22 2Z" 
                    fill="white"
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>

          </>
        ) : (
          <div className="no-chat-selected">Pilih pengguna untuk memulai chat</div>
        )}
        {/* Custom Confirmation Modal */}
        {showConfirmModal && (
          <div className="custom-confirm-modal-overlay">
            <div className="custom-confirm-modal-content">
              <p>{confirmModalMessage}</p>
              <div className="custom-confirm-modal-buttons">
                <button onClick={() => {
                  if (confirmModalAction) {
                    confirmModalAction();
                  }
                  setShowConfirmModal(false);
                }}>Ya</button>
                <button onClick={() => setShowConfirmModal(false)}>Tidak</button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Media Preview Modal */}
      {showMediaPreview && (
        <div
          className="media-preview-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            cursor: 'pointer'
          }}
          onClick={() => setShowMediaPreview(false)}
        >
          <div
             style={{
               position: 'relative',
               maxWidth: '95vw',
               maxHeight: '95vh',
               minWidth: '300px',
               minHeight: '300px',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center'
             }}
             onClick={(e) => e.stopPropagation()}
           >
            {/* Close Button */}
            <button
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '30px',
                cursor: 'pointer',
                zIndex: 1001,
                padding: '5px 10px'
              }}
              onClick={() => setShowMediaPreview(false)}
            >
              ×
            </button>
            
            {/* Media Content */}
            {previewMediaType === 'image' ? (
              <img
                src={previewMediaUrl}
                alt="Preview"
                style={{
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '95vw',
                  maxHeight: '95vh',
                  minWidth: '400px',
                  minHeight: '300px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  const errorDiv = document.createElement('div');
                  errorDiv.innerHTML = '<div style="color: white; text-align: center; padding: 20px;">❌ Gambar tidak dapat dimuat</div>';
                  e.target.parentNode.appendChild(errorDiv);
                }}
              />
            ) : previewMediaType === 'video' ? (
              <video
                src={previewMediaUrl}
                controls
                autoPlay
                style={{
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '95vw',
                  maxHeight: '95vh',
                  minWidth: '400px',
                  minHeight: '300px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  const errorDiv = document.createElement('div');
                  errorDiv.innerHTML = '<div style="color: white; text-align: center; padding: 20px;">❌ Video tidak dapat dimuat</div>';
                  e.target.parentNode.appendChild(errorDiv);
                }}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
   );
};

// CSS untuk styling gambar di pesan
<style>
{`
.message-media {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-image {
  max-width: 150px;
  max-height: 150px;
  width: 100%; /* Tambahkan ini */
  height: auto; /* Tambahkan ini */
  border-radius: 8px;
  object-fit: cover;
}

.message-video {
  max-width: 150px;
  max-height: 150px;
  width: 100%; /* Tambahkan ini */
  height: auto; /* Tambahkan ini */
  border-radius: 8px;
  object-fit: cover;
}
 
.message-caption {
  margin: 0;
  padding: 4px 8px;
  background: rgba(0,0,0,0.1);
  border-radius: 4px;
}
`}
</style>

export default ChatPage;
