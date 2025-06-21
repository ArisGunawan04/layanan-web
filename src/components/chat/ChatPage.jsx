import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../App.css';
import io from 'socket.io-client';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { FaEllipsisV, FaTrash, FaBan, FaPlus, FaInfoCircle, FaUsers, FaUserTimes, FaCrown, FaUserShield } from 'react-icons/fa';
import CreateGroup from '../group/CreateGroup'; // Import CreateGroup component
import styled from 'styled-components';

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeTab, setActiveTab] = useState('pesan');
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
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showGroupDetailModal, setShowGroupDetailModal] = useState(false);
  const [groupDetailData, setGroupDetailData] = useState(null);
  const [showChangeGroupPhotoModal, setShowChangeGroupPhotoModal] = useState(false);
  const [selectedGroupPhoto, setSelectedGroupPhoto] = useState(null);
  const [groupPhotoPreview, setGroupPhotoPreview] = useState('');
  const messagesEndRef = useRef(null);
  const socket = useRef(null);
  const navigate = useNavigate();
  
  const isUserOnline = (lastSeen) => {
    if (!lastSeen) return false;
    try {
      const lastSeenDate = new Date(lastSeen);
      const now = new Date();
      const diffInMinutes = (now - lastSeenDate) / (1000 * 60);
      return diffInMinutes < 5;
    } catch (error) {
      console.error('Error parsing lastSeen date:', error);
      return false;
    }
  };
  
  const getLastSeenText = (lastSeen) => {
    if (!lastSeen) return 'Tidak diketahui';
    try {
      return formatDistanceToNow(new Date(lastSeen), { addSuffix: true, locale: id });
    } catch (error) {
      console.error('Error formatting lastSeen date:', error);
      return 'Tidak diketahui';
    }
  };

  const handleShowGroupDetail = async () => {
    if (!selectedGroup) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/groups/${selectedGroup.id_group}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Buat mapping user ID ke data pengguna untuk referensi cepat
      const userMap = {};
      response.data.GroupMembers?.forEach(member => {
        if (member.User) {
          userMap[member.id_user] = {
            nama_pengirim: member.User.nama || member.User.username,
            foto_pengirim: member.User.foto_profil || ''
          };
        }
      });
      
      // Update messages dengan data pengirim yang lengkap
      setMessages(prevMessages => 
        prevMessages.map(msg => ({
          ...msg,
          nama_pengirim: userMap[msg.id_pengirim]?.nama_pengirim || msg.nama_pengirim,
          foto_pengirim: userMap[msg.id_pengirim]?.foto_pengirim || msg.foto_pengirim
        }))
      );
      
      setGroupDetailData(response.data);
      setShowGroupDetailModal(true);
    } catch (error) {
      console.error('Error fetching group details:', error);
    }
  };

  const handleKickMember = async (memberId) => {
    if (!selectedGroup || !groupDetailData) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/groups/${selectedGroup.id_group}/members/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh group data
      const response = await axios.get(`http://localhost:5000/api/groups/${selectedGroup.id_group}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroupDetailData(response.data);
      alert('Anggota berhasil dikeluarkan dari grup');
    } catch (error) {
      console.error('Error kicking member:', error);
      alert('Gagal mengeluarkan anggota. Silakan coba lagi.');
    }
  };

  const handlePromoteMember = async (memberId, currentRole) => {
    if (!selectedGroup || !groupDetailData) return;
    
    const newRole = currentRole === 'member' ? 'moderator' : 'member';
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/groups/${selectedGroup.id_group}/members/${memberId}/role`, {
        role: newRole
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh group data
      const response = await axios.get(`http://localhost:5000/api/groups/${selectedGroup.id_group}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroupDetailData(response.data);
      alert(`Anggota berhasil ${newRole === 'moderator' ? 'dipromosikan menjadi moderator' : 'diturunkan menjadi anggota biasa'}`);
    } catch (error) {
      console.error('Error updating member role:', error);
      alert('Gagal mengubah role anggota. Silakan coba lagi.');
    }
  };

  const handleChangeGroupPhoto = () => {
    setShowChangeGroupPhotoModal(true);
  };

  const handleGroupPhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedGroupPhoto(file);
        const previewUrl = URL.createObjectURL(file);
        setGroupPhotoPreview(previewUrl);
      } else {
        alert('Hanya file gambar yang diizinkan');
      }
    }
  };

  const handleUploadGroupPhoto = async () => {
    if (!selectedGroupPhoto || !selectedGroup) return;

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', selectedGroupPhoto);

      const response = await axios.put(
        `http://localhost:5000/api/groups/${selectedGroup.id_grup}/photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Update group data
      setSelectedGroup(prev => ({
        ...prev,
        foto_grup: response.data.foto_grup
      }));

      // Refresh group detail data if modal is open
      if (groupDetailData) {
        setGroupDetailData(prev => ({
          ...prev,
          foto_grup: response.data.foto_grup
        }));
      }

      // Reset states
      setSelectedGroupPhoto(null);
      setGroupPhotoPreview('');
      setShowChangeGroupPhotoModal(false);
      
      alert('Foto grup berhasil diubah!');
      
      // Refresh groups list
      fetchGroups();
    } catch (error) {
      console.error('Error uploading group photo:', error);
      alert('Gagal mengubah foto grup. Silakan coba lagi.');
    }
  };

  const cancelGroupPhotoChange = () => {
    if (groupPhotoPreview) {
      URL.revokeObjectURL(groupPhotoPreview);
    }
    setSelectedGroupPhoto(null);
    setGroupPhotoPreview('');
    setShowChangeGroupPhotoModal(false);
  };

  useEffect(() => {
    socket.current = io('http://localhost:5000');

    socket.current.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    
    socket.current.on('receiveGroupMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    
    socket.current.on('connect_error', (error) => {
      console.error('Koneksi socket error:', error);
    });
    
    socket.current.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);
  
  const fetchGroups = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      const response = await axios.get('http://localhost:5000/api/groups/my-groups', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }
        const [usersResponse, groupsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/users', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/groups/my-groups', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setUsers(usersResponse.data);
        setGroups(groupsResponse.data);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }
        if (error.response) {
          console.error('Data error:', error.response.data);
        } else {
          console.error('Pesan error:', error.message);
        }
      }
    };

    fetchInitialData();
    
    const handleClickOutside = (event) => {
      if (!event.target.closest('.chat-menu-container')) {
        setShowChatMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    
    const interval = setInterval(fetchInitialData, 30000); // Poll every 30 seconds
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [fetchGroups]); // fetchGroups is stable due to useCallback

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  const fetchMessages = useCallback(async (id, type) => {
    if (!id) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      
      let response;
      if (type === 'user') {
        response = await axios.get(`http://localhost:5000/api/chats/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (type === 'group') {
        response = await axios.get(`http://localhost:5000/api/groups/${id}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { include_sender: true } // Pastikan API mengembalikan data pengirim
        });
      }
      
      // Pastikan data pengirim tersedia
      const messagesWithSender = response.data.map(message => {
        if (type === 'group' && message.Pengirim) {
          return {
            ...message,
            nama_pengirim: message.Pengirim.nama || message.Pengirim.username || 'Anggota Grup',
            foto_pengirim: message.Pengirim.foto_profil
          };
        }
        return message;
      });
      
      setMessages(messagesWithSender);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
    }
  }, []);

  useEffect(() => {
    if (initialRecipientId) {
      const user = users.find(u => u.user_id === parseInt(initialRecipientId));
      if (user) {
        setSelectedUser(user);
        setSelectedGroup(null);
        setActiveTab('pesan');
        fetchMessages(user.user_id, 'user');
      } else {
        const group = groups.find(g => g.id_grup === parseInt(initialRecipientId));
        if (group) {
          setSelectedGroup(group);
          setSelectedUser(null);
          setActiveTab('grup');
          fetchMessages(group.id_grup, 'group');
        }
      }
    }
  }, [initialRecipientId, users, groups, fetchMessages]);

  useEffect(() => {
    if (selectedUser) {
      const updatedUser = users.find(u => u.user_id === selectedUser.user_id);
      if (updatedUser) setSelectedUser(updatedUser);
    }
    if (selectedGroup) {
      const updatedGroup = groups.find(g => g.id_grup === selectedGroup.id_grup);
      if (updatedGroup) setSelectedGroup(updatedGroup);
    }
  }, [users, groups, selectedUser, selectedGroup]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (groupPhotoPreview) {
        URL.revokeObjectURL(groupPhotoPreview);
      }
    };
  }, [previewUrl, groupPhotoPreview]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSelectedGroup(null);
    setActiveTab('pesan');
    fetchMessages(user.user_id, 'user');
  };
  
  const handleGroupSelect = (group) => {
    if (!group || (!group.id_grup && !group.id_group)) {
      console.error('Grup atau ID grup tidak valid:', group);
      return;
    }
    
    const normalizedGroup = {
      ...group,
      id_grup: group.id_grup || group.id_group,
      ...(group.Group && {
        nama_grup: group.nama_grup || group.Group.nama_group,
        deskripsi: group.deskripsi || group.Group.deskripsi || '',
        id_admin: group.id_admin || group.Group.id_admin,
        foto_grup: group.foto_grup || group.Group.foto_grup
      })
    };
    
    setSelectedGroup(normalizedGroup);
    setSelectedUser(null);
    setActiveTab('grup');
    fetchMessages(normalizedGroup.id_grup, 'group');
  };

  const handleDeleteChat = async () => {
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/chats/delete-chat/${selectedUser.user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages([]);
      setShowChatMenu(false);
      setShowConfirmModal(false);
      alert('Percakapan berhasil dihapus');
    } catch (error) {
      console.error('Gagal menghapus chat:', error);
      const errorMessage = error.response?.data?.message || 'Gagal menghapus percakapan. Silakan coba lagi.';
      alert(errorMessage);
    }
  };
  
  const handleDeleteGroupChat = async () => {
    if (!selectedGroup) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/groups/${selectedGroup.id_grup}/delete-messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages([]);
      setShowChatMenu(false);
      setShowConfirmModal(false);
      alert('Percakapan grup berhasil dihapus');
    } catch (error) {
      console.error('Gagal menghapus chat grup:', error);
      const errorMessage = error.response?.data?.message || 'Gagal menghapus percakapan grup. Silakan coba lagi.';
      alert(errorMessage);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || (!selectedUser && !selectedGroup)) return;

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      let response;
      let endpoint = '';
      let payload = {};
      
      if (selectedFile) {
        formData.append('pesan', newMessage);
        formData.append('file', selectedFile);
        if (activeTab === 'pesan') {
          formData.append('id_penerima', selectedUser.user_id);
          endpoint = 'http://localhost:5000/api/chats/send-file';
        } else {
          formData.append('id_grup', selectedGroup.id_grup);
          endpoint = `http://localhost:5000/api/groups/${selectedGroup.id_grup}/messages/file`;
        }
        payload = formData;
      } else {
        if (activeTab === 'pesan') {
          endpoint = 'http://localhost:5000/api/chats/send';
          payload = { id_penerima: selectedUser.user_id, pesan: newMessage };
        } else {
          endpoint = `http://localhost:5000/api/groups/${selectedGroup.id_grup}/messages`;
          payload = { pesan: newMessage };
        }
      }

      response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(selectedFile && { 'Content-Type': 'multipart/form-data' })
        }
      });
      
      if (response.data.chat) {
        socket.current.emit('sendMessage', response.data.chat);
      } else if (response.data.groupChat) {
        socket.current.emit('sendGroupMessage', response.data.groupChat);
      }

      setNewMessage('');
      if (selectedFile) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
        setSelectedFile(null);
      }
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleAttachmentClick = () => {
    setShowAttachmentMenu(!showAttachmentMenu);
  };

  const handleFileUpload = (type) => {
    setSelectedFileType(type === 'image' ? 'media' : 'document');
    setShowFilePopup(true);
    setShowAttachmentMenu(false);
  };

  const handleFileSelect = (fileType) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = fileType === 'media' ? 'image/*,video/*,.mkv' : '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt';
    fileInput.click();
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedFile(file);
        if (file.type.startsWith('image/')) {
          const fileUrl = URL.createObjectURL(file);
          setPreviewUrl(fileUrl);
        } else {
          setPreviewUrl('');
        }
      }
    };
  };
   
  return (
    <div className="chat-container">
      <div className="sidebar-chat">
        <div className="chat-tabs">
          <div 
            className={`tab-item ${activeTab === 'permintaan' ? 'active' : ''}`}
            onClick={() => setActiveTab('permintaan')}
          >
            Permintaan
          </div>
          <div 
            className={`tab-item ${activeTab === 'pesan' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('pesan');
              setSelectedGroup(null);
              setMessages([]);
            }}
          >
            Pesan
          </div>
          <div 
            className={`tab-item ${activeTab === 'grup' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('grup');
              setSelectedUser(null);
              setMessages([]);
            }}
          >
            Grup
          </div>
        </div>
        {activeTab === 'pesan' && (
          <>
            <h2>Pengguna</h2>
            <ul>
              {users.length > 0 ? (
                users.map((user) => (
                  <li
                    key={user.user_id}
                    onClick={() => handleUserSelect(user)}
                    className={selectedUser?.user_id === user.user_id ? 'active' : ''}
                  >
                    <img 
                      src={user.foto_profil ? `http://localhost:5000${user.foto_profil}` : '/default-avatar.svg'} 
                      alt={user.username} 
                      className="profile-pic"
                      onError={(e) => { 
                        e.target.onerror = null; 
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
          </>
        )}
        {activeTab === 'grup' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '10px' }}>
              <h2>Grup</h2>
              <button 
                onClick={() => setShowCreateGroupModal(true)}
                className="create-group-btn"
                title="Buat Grup Baru"
              >
                <FaPlus />
              </button>
            </div>
            <ul>
              {groups.length > 0 ? (
                groups.map((group) => {
                  // Normalisasi data grup seperti di handleGroupSelect
                  const normalizedGroup = {
                    ...group,
                    id_grup: group.id_grup || group.id_group,
                    ...(group.Group && {
                      nama_grup: group.nama_grup || group.Group.nama_group,
                      deskripsi: group.deskripsi || group.Group.deskripsi || '',
                      id_admin: group.id_admin || group.Group.id_admin,
                      foto_grup: group.foto_grup || group.Group.foto_grup
                    })
                  };
                  
                  return (
                    <li
                      key={normalizedGroup.id_grup}
                      onClick={() => handleGroupSelect(normalizedGroup)}
                      className={selectedGroup?.id_grup === normalizedGroup.id_grup ? 'active' : ''}
                    >
                      <img 
                        src={normalizedGroup.foto_grup ? 
                          `http://localhost:5000${normalizedGroup.foto_grup.startsWith('/') ? '' : '/'}${normalizedGroup.foto_grup}` : 
                          '/default-avatar.svg'
                        } 
                        alt={normalizedGroup.nama_grup} 
                        className="profile-pic"
                        onError={(e) => { 
                          e.target.onerror = null;
                          e.target.src = '/default-avatar.svg'; 
                        }}
                      />
                      <div className="user-status-container">
                        <span style={{fontWeight: 'bold'}}>
                          {normalizedGroup.nama_grup || 'Grup Tanpa Nama'}
                        </span>
                        <div className="user-status">
                          <span className="status-text">
                            {normalizedGroup.Group?.GroupMembers?.length || 
                             normalizedGroup.GroupMembers?.length || 
                             normalizedGroup.jumlah_anggota || 0} anggota
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li>Tidak ada grup.</li>
              )}
            </ul>
          </>
        )}
      </div>
      <div className="chat-area">
        {(selectedUser || selectedGroup) ? (
          <>
            <div className="chat-header">
              <img 
                  src={selectedUser ? (selectedUser.foto_profil ? `http://localhost:5000${selectedUser.foto_profil.startsWith('/') ? '' : '/'}${selectedUser.foto_profil}` : '/default-avatar.svg') : (selectedGroup.foto_grup ? `http://localhost:5000${selectedGroup.foto_grup.startsWith('/') ? '' : '/'}${selectedGroup.foto_grup}` : '/default-avatar.svg')} 
                  alt={selectedUser ? selectedUser.username : selectedGroup.nama_grup} 
                  className="profile-pic"
                  onError={(e) => { e.target.src = '/default-avatar.svg'; }}
                />
              <div className="user-status-container">
                <h3>{selectedUser ? selectedUser.username : selectedGroup.nama_grup}</h3>
                <div className="user-status">
                  <span className="status-text">
                    {selectedUser ? (isUserOnline(selectedUser.last_seen) ? <span style={{ color: 'green' }}>sedang aktif</span> : `aktif ${getLastSeenText(selectedUser.last_seen)}`) : `${selectedGroup.Group?.GroupMembers?.length || selectedGroup.GroupMembers?.length || selectedGroup.jumlah_anggota || 0} anggota`}
                  </span>
                </div>
              </div>
              <div className="chat-menu-container">
                <button className="chat-menu-button" onClick={() => setShowChatMenu(!showChatMenu)}>
                  <FaEllipsisV />
                </button>
                {showChatMenu && (
                   <div className="chat-dropdown-menu">
                     {activeTab === 'grup' && selectedGroup && (
                       <button 
                         className="menu-item view-group-detail"
                         onClick={() => {
                           handleShowGroupDetail();
                           setShowChatMenu(false);
                         }}
                       >
                         <FaInfoCircle /> Lihat Detail Grup
                       </button>
                     )}
                     {activeTab === 'pesan' && (
                       <button 
                         className="menu-item delete-chat"
                         onClick={() => {
                           setConfirmModalMessage('Apakah Anda yakin ingin menghapus semua pesan dalam chat ini?');
                           setConfirmModalAction(() => handleDeleteChat); // FIX: Corrected function reference
                           setShowConfirmModal(true);
                           setShowChatMenu(false);
                         }}
                       >
                         <FaTrash /> Hapus Chat
                       </button>
                     )}
                     {activeTab === 'grup' && (
                       <button 
                         className="menu-item delete-chat"
                         onClick={() => {
                           setConfirmModalMessage('Apakah Anda yakin ingin menghapus semua pesan dalam grup ini?');
                           setConfirmModalAction(() => handleDeleteGroupChat); // FIX: Corrected function reference
                           setShowConfirmModal(true);
                           setShowChatMenu(false);
                         }}
                       >
                         <FaTrash /> Hapus Chat Grup
                       </button>
                     )}
                     {activeTab === 'pesan' && (
                       <button
                         className="menu-item block-user"
                         onClick={() => {
                           setConfirmModalMessage(`Apakah Anda yakin ingin memblokir ${selectedUser.username}?`);
                           // FIX: Corrected function definition
                           setConfirmModalAction(() => () => {
                             console.log('Block user:', selectedUser.username);
                             // TODO: Implement block user functionality
                             setShowConfirmModal(false);
                           });
                           setShowConfirmModal(true);
                           setShowChatMenu(false);
                         }}
                       >
                         <FaBan /> Blokir Pengguna
                       </button>
                     )}
                   </div>
                 )}
              </div>
            </div>
            <div className="messages">
              {messages.map((msg, idx) => {
                const userId = JSON.parse(localStorage.getItem('user'))?.id;
                const isCurrentUser = msg.id_pengirim === userId;
                // Deteksi jika ini chat grup
                const isGroupChat = !!selectedGroup;
                // Cek apakah pengirim berbeda dari pesan sebelumnya (hanya untuk grup)
                let showSenderInfo = false;
                if (isGroupChat && !isCurrentUser) { // Hanya tampilkan info pengirim di grup chat
                  if (idx === 0) {
                    showSenderInfo = true;
                  } else {
                    const prevMsg = messages[idx - 1];
                    showSenderInfo = prevMsg.id_pengirim !== msg.id_pengirim;
                  }
                  // Pastikan data pengirim tersedia
                  if (!msg.nama_pengirim) {
                    // Coba dapatkan dari data grup jika tersedia
                    if (groupDetailData?.GroupMembers) {
                      const sender = groupDetailData.GroupMembers.find(
                        m => m.id_user === msg.id_pengirim
                      );
                      if (sender?.User) {
                        msg.nama_pengirim = sender.User.nama || sender.User.username || 'Anggota Grup';
                        msg.foto_pengirim = sender.User.foto_profil;
                      }
                    }
                  }
                }

                return (
                  <div
                    key={msg.id_chat || msg.id_group_chat}
                    className={`message ${isCurrentUser ? 'sent' : 'received'}`}
                  >
                    {showSenderInfo && (
                      <div className="message-sender-info">
                        <img
                          src={msg.foto_pengirim ? `http://localhost:5000${msg.foto_pengirim}` : '/default-avatar.svg'}
                          alt={msg.nama_pengirim || 'Pengguna'}
                          onError={(e) => { e.target.src = '/default-avatar.svg'; }}
                        />
                        <span>{msg.nama_pengirim || 'Anggota Grup'}</span>
                      </div>
                    )}
                    {msg.media_url ? (
                      <div className="message-media">
                        <>
                          {(() => {
                            const fileName = msg.media_url.split('/').pop();
                            const fileExt = fileName.split('.').pop().toLowerCase();
                            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(fileExt);
                            const isVideo = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(fileExt);

                            if (isImage) {
                              return (
                                <>
                                  <img
                                    src={`http://localhost:5000${msg.media_url}`}
                                    alt="Media terkirim"
                                    className="message-image"
                                    onClick={() => {
                                      setPreviewMediaUrl(`http://localhost:5000${msg.media_url}`);
                                      setPreviewMediaType('image');
                                      setShowMediaPreview(true);
                                    }}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'block';
                                    }}
                                  />
                                  <div className="media-error">❌ Gagal memuat gambar</div>
                                </>
                              );
                            } else if (isVideo) {
                              return (
                                <>
                                  <div className="video-container"
                                    onClick={() => {
                                      setPreviewMediaUrl(`http://localhost:5000${msg.media_url}`);
                                      setPreviewMediaType('video');
                                      setShowMediaPreview(true);
                                    }}
                                  >
                                    <video
                                      src={`http://localhost:5000${msg.media_url}`}
                                      className="message-video"
                                      onError={(e) => {
                                        e.target.parentElement.querySelector('.video-play-button').style.display = 'none';
                                        e.target.parentElement.querySelector('.media-error').style.display = 'block';
                                      }}
                                    />
                                    <div className="video-play-button">▶</div>
                                    <div className="media-error">❌ Gagal memuat video</div>
                                  </div>
                                </>
                              );
                            } else {
                              return (
                                <a href={`http://localhost:5000${msg.media_url}`} target="_blank" rel="noopener noreferrer" className="document-file">
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '20px' }}>📄</span>
                                    <div>
                                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>{fileName}</div>
                                      <div style={{ fontSize: '12px', color: '#666' }}>Klik untuk membuka</div>
                                    </div>
                                  </div>
                                </a>
                              );
                            }
                          })()}
                          {msg.pesan && <p className="message-caption">{msg.pesan}</p>}
                        </>
                      </div>
                    ) : (
                      <p>{msg.pesan}</p>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            {showFilePopup && (
              <div className="attachment-popup-overlay" onClick={() => setShowFilePopup(false)}>
                <div className="attachment-popup-content" onClick={(e) => e.stopPropagation()}>
                  <div className="attachment-popup-header">
                    <h3>{selectedFileType === 'media' ? 'Masukkan Foto/Video' : 'Masukkan Dokumen'}</h3>
                    <button className="attachment-popup-close" onClick={() => setShowFilePopup(false)}>×</button>
                  </div>
                  <div className="attachment-popup-options">
                    <div className="attachment-popup-option" onClick={() => handleFileSelect(selectedFileType)}>
                      <div className={`attachment-popup-icon ${selectedFileType}`}>
                        {/* SVG icons can be placed here */}
                      </div>
                      <div className="attachment-popup-text">
                        <h4>Pilih dari Perangkat</h4>
                        <p>{selectedFileType === 'media' ? 'JPG, PNG, MP4...' : 'PDF, DOC, TXT...'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {(previewUrl || selectedFile) && (
              <div className="file-preview-container">
                <div className="file-preview">
                  <button
                    type="button"
                    onClick={() => {
                      if (previewUrl) URL.revokeObjectURL(previewUrl);
                      setPreviewUrl('');
                      setSelectedFile(null);
                    }}
                    className="file-preview-remove-btn"
                    aria-label="Hapus preview"
                  >
                    ×
                  </button>
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="file-preview-image" />
                  ) : (
                    <div className="file-preview-info">
                      <span>📄 {selectedFile.name}</span>
                      <small>{(selectedFile.size / 1024).toFixed(1)} KB</small>
                    </div>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="message-input">
              <div className="attachment-container">
                <button type="button" className="attachment-button" onClick={handleAttachmentClick}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4V20M4 12H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {showAttachmentMenu && (
                  <div className="attachment-menu">
                    <div className="attachment-item" onClick={() => handleFileUpload('image')} title="Gambar/Video">
                      <svg width="16" height="16" viewBox="0 0 24 24"><path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM13.96 12.29L11.21 15.83L9.25 13.47L6.5 17H17.5L13.96 12.29Z" fill="white"/></svg>
                    </div>
                    <div className="attachment-item" onClick={() => handleFileUpload('document')} title="Dokumen">
                      <svg width="16" height="16" viewBox="0 0 24 24"><path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="white"/></svg>
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
              <button type="submit" className="send-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">Pilih {activeTab === 'pesan' ? 'pengguna' : 'grup'} untuk memulai percakapan</div>
        )}
        
        {showConfirmModal && (
          <div className="custom-confirm-modal-overlay">
            <div className="custom-confirm-modal-content">
              <p>{confirmModalMessage}</p>
              <div className="custom-confirm-modal-buttons">
                <button onClick={() => {
                  if (confirmModalAction) confirmModalAction()();
                  setShowConfirmModal(false);
                }}>Ya</button>
                <button onClick={() => setShowConfirmModal(false)}>Tidak</button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {showCreateGroupModal && (
        <CreateGroup 
          onClose={() => setShowCreateGroupModal(false)} 
          onGroupCreated={fetchGroups}
        />
      )}

      {showMediaPreview && (
        <div className="media-preview-overlay" onClick={() => setShowMediaPreview(false)}>
          <div className="media-preview-content" onClick={(e) => e.stopPropagation()}>
            <button className="media-preview-close" onClick={() => setShowMediaPreview(false)}>×</button>
            {previewMediaType === 'image' ? (
              <img
                src={previewMediaUrl}
                alt="Preview"
                className="media-preview-item"
              />
            ) : previewMediaType === 'video' ? (
              <video
                src={previewMediaUrl}
                controls
                autoPlay
                className="media-preview-item"
              />
            ) : null}
          </div>
        </div>
      )}

      {showGroupDetailModal && groupDetailData && (
        <GroupDetailModal>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Detail Grup</ModalTitle>
              <CloseButton onClick={() => setShowGroupDetailModal(false)}>×</CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <div style={{ position: 'relative', display: 'inline-block', margin: '0 auto 20px' }}>
                {groupDetailData.foto_grup ? (
                  <img 
                    src={`http://localhost:5000${groupDetailData.foto_grup}`}
                    alt={groupDetailData.nama_group}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '16px',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <GroupModalIcon style={{ display: groupDetailData.foto_grup ? 'none' : 'flex' }}>
                  <FaUsers />
                </GroupModalIcon>
                {(() => {
                  const currentUser = JSON.parse(localStorage.getItem('user')) || {};
                  const isAdmin = groupDetailData.id_admin === currentUser?.user_id;
                  return isAdmin ? (
                    <button
                      onClick={handleChangeGroupPhoto}
                      style={{
                        position: 'absolute',
                        bottom: '-5px',
                        right: '-5px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: 'none',
                        background: '#4a6cf7',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px'
                      }}
                      title="Ubah Foto Grup"
                    >
                      ✏️
                    </button>
                  ) : null;
                })()
                }
              </div>
              
              <GroupModalName>{groupDetailData.nama_group}</GroupModalName>
              
              {groupDetailData.deskripsi && (
                <GroupModalDescription>
                  {groupDetailData.deskripsi}
                </GroupModalDescription>
              )}
              
              <GroupModalStats>
                <StatItem>
                  <StatNumber>{groupDetailData.GroupMembers?.length || 0}</StatNumber>
                  <StatLabel>Anggota</StatLabel>
                </StatItem>
                <StatItem>
                  <StatNumber>Publik</StatNumber>
                  <StatLabel>Tipe Grup</StatLabel>
                </StatItem>
              </GroupModalStats>
              
              <AdminInfo>
                <AdminAvatar>
                  {groupDetailData.Admin?.foto_profil ? (
                    <img 
                      src={`http://localhost:5000${groupDetailData.Admin.foto_profil.startsWith('/') ? '' : '/'}${groupDetailData.Admin.foto_profil}`}
                      alt={groupDetailData.Admin?.name || groupDetailData.Admin?.username || 'Admin'}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div style={{
                    display: groupDetailData.Admin?.foto_profil ? 'none' : 'flex',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    backgroundColor: '#4a6cf7',
                    color: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}>
                    {(groupDetailData.Admin?.name || groupDetailData.Admin?.username || 'A').charAt(0).toUpperCase()}
                  </div>
                </AdminAvatar>
                <AdminDetails>
                  <AdminName>{groupDetailData.Admin?.name || groupDetailData.Admin?.username || 'Unknown'}</AdminName>
                  <AdminRole>Administrator Grup</AdminRole>
                </AdminDetails>
              </AdminInfo>
              
              {groupDetailData.GroupMembers && groupDetailData.GroupMembers.length > 0 && (
                <MembersList>
                  <MembersTitle>Anggota Grup</MembersTitle>
                  {groupDetailData.GroupMembers.map((member, index) => {
                    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
                    const currentUserId = currentUser?.user_id;
                    
                    // Cari data member untuk user yang sedang login
                    const currentUserMemberData = groupDetailData.GroupMembers.find(m => m.id_user === currentUserId);
                    const currentUserRole = currentUserMemberData?.role?.toLowerCase();
                    
                    const isCurrentUserAdmin = groupDetailData.id_admin === currentUserId;
                    const isCurrentUserModerator = currentUserRole === 'moderator';
                    
                    // Debug log
                    console.log('Current user ID:', currentUserId);
                    console.log('Current user role:', currentUserRole);
                    console.log('Member data:', member);
                    
                    // Admin bisa mengelola moderator dan member
                    // Moderator hanya bisa mengelola member biasa
                    const canManageMember = (
                      (isCurrentUserAdmin || 
                       (isCurrentUserModerator && member.role?.toLowerCase() === 'member')
                      ) && 
                      member.id_user !== currentUserId
                    );
                    
                    console.log('Can manage member:', canManageMember, {
                      isCurrentUserAdmin, 
                      isCurrentUserModerator, 
                      memberRole: member.role, 
                      isNotSelf: member.id_user !== currentUserId
                    });
                    
                    return (
                      <MemberItem key={index}>
                        <MemberAvatar>
                          {member.User?.foto_profil ? (
                            <img 
                              src={`http://localhost:5000${member.User.foto_profil.startsWith('/') ? '' : '/'}${member.User.foto_profil}`}
                              alt={member.User?.name || member.User?.username || 'User'}
                              style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div style={{
                            display: member.User?.foto_profil ? 'none' : 'flex',
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            backgroundColor: '#4a6cf7',
                            color: 'white',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            fontWeight: 'bold'
                          }}>
                            {(member.User?.name || member.User?.username || 'U').charAt(0).toUpperCase()}
                          </div>
                        </MemberAvatar>
                        <MemberInfo>
                          <MemberName>{member.User?.name || member.User?.username || 'Unknown'}</MemberName>
                          <MemberRoleContainer>
                            <MemberRole>
                              {(() => {
                                const role = member.role?.toLowerCase();
                                console.log(`Rendering member ${member.User?.name || member.User?.username} with role:`, role);
                                
                                if (role === 'admin') {
                                  return (
                                    <>
                                      <FaCrown style={{ 
                                        color: '#ffd700', 
                                        fontSize: '14px',
                                        display: 'inline-block',
                                        marginRight: '4px'
                                      }} />
                                      <span>Administrator</span>
                                    </>
                                  );
                                } else if (role === 'moderator') {
                                  return (
                                    <>
                                      <FaUserShield style={{ 
                                        color: '#4a6cf7', 
                                        fontSize: '14px',
                                        display: 'inline-block',
                                        marginRight: '4px'
                                      }} />
                                      <span>Moderator</span>
                                    </>
                                  );
                                } else {
                                  return <span>Anggota</span>;
                                }
                              })()}
                            </MemberRole>
                          </MemberRoleContainer>
                        </MemberInfo>
                        {canManageMember && (
                          <MemberActions>
                            {isCurrentUserAdmin && (
                              <ActionButton 
                                onClick={() => handlePromoteMember(member.id_user, member.role)}
                                title={member.role === 'moderator' ? 'Turunkan ke Anggota' : 'Promosikan ke Moderator'}
                                $promote
                              >
                                <FaUserShield />
                              </ActionButton>
                            )}
                            <ActionButton 
                              onClick={() => {
                                if (window.confirm(`Apakah Anda yakin ingin mengeluarkan ${member.User?.name || member.User?.username} dari grup?`)) {
                                  handleKickMember(member.id_user);
                                }
                              }}
                              title="Keluarkan dari Grup"
                              $kick
                            >
                              <FaUserTimes />
                            </ActionButton>
                          </MemberActions>
                        )}
                      </MemberItem>
                    );
                  })}
                </MembersList>
              )}
            </ModalBody>
          </ModalContent>
        </GroupDetailModal>
      )}

      {showChangeGroupPhotoModal && (
        <GroupDetailModal>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Ubah Foto Grup</ModalTitle>
              <CloseButton onClick={cancelGroupPhotoChange}>×</CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <div style={{ textAlign: 'center' }}>
                {groupPhotoPreview ? (
                  <div style={{ marginBottom: '20px' }}>
                    <img 
                      src={groupPhotoPreview}
                      alt="Preview"
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '16px',
                        objectFit: 'cover',
                        border: '2px solid #e0e0e0'
                      }}
                    />
                  </div>
                ) : (
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '16px',
                    border: '2px dashed #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    color: '#666'
                  }}>
                    Pilih Foto
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGroupPhotoSelect}
                  style={{ marginBottom: '20px' }}
                />
                
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    onClick={handleUploadGroupPhoto}
                    disabled={!selectedGroupPhoto}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: selectedGroupPhoto ? '#4a6cf7' : '#ccc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: selectedGroupPhoto ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Simpan
                  </button>
                  <button
                    onClick={cancelGroupPhotoChange}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#f0f0f0',
                      color: '#333',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Batal
                  </button>
                </div>
              </div>
            </ModalBody>
          </ModalContent>
        </GroupDetailModal>
      )}
    </div>
   );
};

// Styled Components untuk Modal Detail Grup
const GroupDetailModal = styled.div`
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
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const GroupModalIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background: linear-gradient(135deg, #4a6cf7, #667eea);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  margin: 0 auto 20px;
`;

const GroupModalName = styled.h3`
  text-align: center;
  margin: 0 0 10px 0;
  font-size: 22px;
  font-weight: 600;
  color: #333;
`;

const GroupModalDescription = styled.p`
  text-align: center;
  margin: 0 0 20px 0;
  color: #666;
  font-size: 16px;
  line-height: 1.5;
`;

const GroupModalStats = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #4a6cf7;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
`;

const AdminInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const AdminAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #4a6cf7;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
`;

const AdminDetails = styled.div`
  flex: 1;
`;

const AdminName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
`;

const AdminRole = styled.div`
  font-size: 12px;
  color: #666;
`;

const MembersList = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
`;

const MembersTitle = styled.h4`
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const MemberItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
  
  &:last-child {
`;

const MemberAvatar = styled.div`
width: 40px;
height: 40px;
border-radius: 50%;
background-color: #e0e0e0;
display: flex;
align-items: center;
justify-content: center;
margin-right: 12px;
overflow: hidden;
position: relative;
flex-shrink: 0;
`;

const MemberInfo = styled.div`
flex: 1;
`;

const MemberName = styled.div`
  font-weight: 500;
  color: #333;
  font-size: 14px;
`;

const MemberRoleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MemberRole = styled.div`
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
  
  svg {
    font-size: 14px;
    display: inline-block;
    vertical-align: middle;
  }
`;

const MemberActions = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
`;

const ActionButton = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.2s ease;
  
  ${props => props.$kick && `
    background: #ff4757;
    color: white;
    
    &:hover {
      background: #ff3838;
      transform: scale(1.1);
    }
  `}
  
  ${props => props.$promote && `
    background: #4a6cf7;
    color: white;
    
    &:hover {
      background: #3b5ce6;
      transform: scale(1.1);
    }
  `}
`;

export default ChatPage;
