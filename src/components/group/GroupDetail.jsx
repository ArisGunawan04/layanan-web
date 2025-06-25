import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUsers, FaEllipsisV } from 'react-icons/fa';
import api from '../../config/api';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
  
  @media (min-width: 769px) {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 20px;
    padding: 20px;
  }
`;

const Sidebar = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
  
  @media (min-width: 769px) {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const ChatContainer = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  flex: 1;
  
  @media (min-width: 769px) {
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const GroupInfo = styled.div`
  margin-bottom: 20px;
`;

const MobileHeader = styled.div`
  @media (max-width: 768px) {
    background: white;
    padding: 15px 20px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  color: #333;
  cursor: pointer;
  padding: 5px;
`;

const GroupAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #4a6cf7;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

const GroupHeaderInfo = styled.div`
  flex: 1;
`;

const GroupHeaderName = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const GroupMemberCount = styled.p`
  margin: 2px 0 0 0;
  font-size: 12px;
  color: #666;
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  padding: 5px;
`;

const MobileMemberSection = styled.div`
  @media (max-width: 768px) {
    background: #f8f9fa;
    padding: 15px 20px;
    border-bottom: 1px solid #e0e0e0;
  }
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MemberSectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const MemberGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  
  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const MemberCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const MemberAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  overflow: hidden;
`;

const MemberImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MemberNameMobile = styled.span`
  font-size: 12px;
  color: #333;
  font-weight: 500;
  line-height: 1.2;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media (max-width: 480px) {
    font-size: 11px;
    max-width: 50px;
  }
`;

const AddMemberCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
`;

const AddMemberButton = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: #666;
  font-size: 20px;
`;

const AddMemberText = styled.span`
  font-size: 12px;
  color: #666;
  font-weight: 500;
`;

const ViewAllButton = styled.button`
  background: none;
  border: none;
  color: #4a6cf7;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  padding: 0;
  text-align: center;
  width: 100%;
`;

const GroupName = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const GroupDescription = styled.p`
  color: #666;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MemberList = styled.div`
  margin-top: 20px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MemberItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const MemberName = styled.span`
  margin-left: 10px;
`;

const AdminBadge = styled.span`
  background: #4a6cf7;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  margin-left: 10px;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    padding: 15px 20px;
    margin-bottom: 0;
  }
`;

const MessageInput = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px;
  border-top: 1px solid #e0e0e0;
  background: white;
  
  @media (max-width: 768px) {
    padding: 15px 20px;
    gap: 12px;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  
  @media (max-width: 768px) {
    padding: 12px 15px;
    border-radius: 25px;
    border: 1px solid #e0e0e0;
    background: #f8f9fa;
    font-size: 14px;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4a6cf7;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  @media (max-width: 768px) {
    padding: 12px 20px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 600;
  }
`;

const Message = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  background: ${props => props.isMine ? '#e3f2fd' : '#f5f5f5'};
  border-radius: 8px;
  align-self: ${props => props.isMine ? 'flex-end' : 'flex-start'};
  max-width: 70%;
  
  @media (max-width: 768px) {
    padding: 12px 15px;
    border-radius: 12px;
    max-width: 80%;
  }
`;

const MessageSender = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
  
  @media (max-width: 768px) {
    font-size: 11px;
    margin-bottom: 3px;
  }
`;

const MessageContent = styled.div`
  word-break: break-word;
  
  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.4;
  }
`;

const GroupDetail = () => {
  const { id_group } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);

    const fetchGroupDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const [groupResponse, messagesResponse] = await Promise.all([
          api.get(`/api/groups/${id_group}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          api.get(`/api/groups/${id_group}/messages`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setGroup(groupResponse.data);
        setMessages(messagesResponse.data);
      } catch (error) {
        console.error('Error fetching group details:', error);
        if (error.response?.status === 403) {
          navigate('/groups');
        }
      }
    };

    fetchGroupDetails();
  }, [id_group, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        `/api/groups/${id_group}/messages`,
        { pesan: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages([...messages, response.data.chat]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!group) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      {/* Mobile Header */}
      <MobileHeader>
        <BackButton onClick={() => navigate('/groups')}>
          <FaArrowLeft />
        </BackButton>
        <GroupAvatar>
          {group.nama_group.charAt(0).toUpperCase()}
        </GroupAvatar>
        <GroupHeaderInfo>
          <GroupHeaderName>{group.nama_group}</GroupHeaderName>
          <GroupMemberCount>{group.GroupMembers.length} anggota</GroupMemberCount>
        </GroupHeaderInfo>
        <MoreButton>
          <FaEllipsisV />
        </MoreButton>
      </MobileHeader>

      {/* Mobile Member Section */}
      <MobileMemberSection>
        <MemberSectionTitle>
          <FaUsers />
          {group.GroupMembers.length} anggota
        </MemberSectionTitle>
        <MemberGrid>
          {group.GroupMembers.slice(0, 7).map(member => (
             <MemberCard key={member.User.user_id}>
               <MemberAvatar>
                 {member.User.foto_profil ? (
                   <MemberImage 
                     src={`http://localhost:5000${member.User.foto_profil}`}
                     alt={member.User.name}
                     onError={(e) => {
                       e.target.style.display = 'none';
                       e.target.parentNode.innerHTML = member.User.name.charAt(0).toUpperCase();
                       e.target.parentNode.style.color = '#666';
                       e.target.parentNode.style.fontWeight = 'bold';
                     }}
                   />
                 ) : (
                   member.User.name.charAt(0).toUpperCase()
                 )}
               </MemberAvatar>
               <MemberNameMobile>{member.User.name}</MemberNameMobile>
             </MemberCard>
           ))}
          {group.GroupMembers.length > 7 && (
            <AddMemberCard>
              <AddMemberButton>+</AddMemberButton>
              <AddMemberText>tambah anggota</AddMemberText>
            </AddMemberCard>
          )}
        </MemberGrid>
        {group.GroupMembers.length > 7 && (
          <ViewAllButton>lihat semua anggota</ViewAllButton>
        )}
      </MobileMemberSection>

      {/* Desktop Sidebar */}
      <Sidebar>
        <GroupInfo>
          <GroupName>{group.nama_group}</GroupName>
          <GroupDescription>{group.deskripsi}</GroupDescription>
        </GroupInfo>
        <MemberList>
          <h3>Anggota Grup</h3>
          {group.GroupMembers.map(member => (
            <MemberItem key={member.User.user_id}>
              <MemberName>{member.User.name}</MemberName>
              {member.role === 'admin' && <AdminBadge>Admin</AdminBadge>}
            </MemberItem>
          ))}
        </MemberList>
      </Sidebar>

      <ChatContainer>
        <ChatMessages>
          {messages.map(message => (
            <Message 
              key={message.id_group_chat}
              isMine={message.id_pengirim === currentUser?.user_id}
            >
              <MessageSender>{message.Pengirim.name}</MessageSender>
              <MessageContent>{message.pesan}</MessageContent>
            </Message>
          ))}
          <div ref={messagesEndRef} />
        </ChatMessages>

        <MessageInput>
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ketik pesan..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
          />
          <Button onClick={handleSendMessage}>Kirim</Button>
        </MessageInput>
      </ChatContainer>
    </Container>
  );
};

export default GroupDetail;
