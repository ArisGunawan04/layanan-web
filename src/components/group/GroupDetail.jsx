import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/api';

const Container = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  padding: 20px;
  height: calc(100vh - 80px);
`;

const Sidebar = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ChatContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
`;

const GroupInfo = styled.div`
  margin-bottom: 20px;
`;

const GroupName = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
`;

const GroupDescription = styled.p`
  color: #666;
  margin-bottom: 20px;
`;

const MemberList = styled.div`
  margin-top: 20px;
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
`;

const MessageInput = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4a6cf7;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Message = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  background: ${props => props.isMine ? '#e3f2fd' : '#f5f5f5'};
  border-radius: 8px;
  align-self: ${props => props.isMine ? 'flex-end' : 'flex-start'};
  max-width: 70%;
`;

const MessageSender = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
`;

const MessageContent = styled.div`
  word-break: break-word;
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
