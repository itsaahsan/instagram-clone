import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  Menu,
  MenuItem,
  Chip,
  Divider,
} from '@mui/material';
import {
  Send,
  AttachFile,
  PhotoCamera,
  EmojiEmotions,
  Call,
  VideoCall,
  Info,
  ArrowBack,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { format, isToday, isYesterday } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { mockConversations, mockUsers } from '@/data/mockData';
import { DirectMessage, Conversation } from '@/types';
import toast from 'react-hot-toast';

interface ExtendedDirectMessage extends DirectMessage {
  reactions?: { emoji: string; users: string[] }[];
  replyTo?: DirectMessage;
  edited?: boolean;
  delivered?: boolean;
  seen?: boolean;
}

const ChatPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ExtendedDirectMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<ExtendedDirectMessage | null>(null);
  const [replyingTo, setReplyingTo] = useState<ExtendedDirectMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ExtendedDirectMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (conversationId) {
      loadConversation();
      loadMessages();
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Simulate typing indicator
    if (newMessage.length > 0 && !isTyping) {
      setIsTyping(true);
      // Simulate other users seeing typing indicator
    } else if (newMessage.length === 0 && isTyping) {
      setIsTyping(false);
    }
  }, [newMessage]);

  useEffect(() => {
    // Simulate incoming messages and typing indicators
    if (conversation) {
      const interval = setInterval(() => {
        // Random chance for new message
        if (Math.random() < 0.1) {
          const otherParticipants = conversation.participants.filter(p => p.id !== user?.id);
          if (otherParticipants.length > 0) {
            const randomUser = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
            const responses = [
              'Hey!', 'How are you?', 'Great photo!', 'Thanks!', 'Sounds good!',
              '😊', '👍', 'See you later!', 'Perfect!', 'Absolutely!'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            const newMsg: ExtendedDirectMessage = {
              id: Date.now().toString(),
              conversationId: conversation.id,
              senderId: randomUser.id,
              sender: randomUser,
              message: randomResponse,
              isRead: false,
              delivered: true,
              seen: false,
              createdAt: new Date(),
            };
            
            setMessages(prev => [...prev, newMsg]);
          }
        }

        // Random typing indicator
        if (Math.random() < 0.05) {
          const otherParticipants = conversation.participants.filter(p => p.id !== user?.id);
          if (otherParticipants.length > 0) {
            const randomUser = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
            setTypingUsers([randomUser.displayName]);
            setTimeout(() => setTypingUsers([]), 3000);
          }
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [conversation, user?.id]);

  const loadConversation = () => {
    const found = mockConversations.find(c => c.id === conversationId);
    if (found) {
      setConversation(found);
    } else {
      navigate('/messages');
    }
  };

  const loadMessages = () => {
    // Generate mock messages for the conversation
    const mockMessages: ExtendedDirectMessage[] = [
      {
        id: '1',
        conversationId: conversationId!,
        senderId: user?.id === '1' ? '2' : '1',
        sender: mockUsers.find(u => u.id === (user?.id === '1' ? '2' : '1'))!,
        message: 'Hey! How are you doing?',
        isRead: true,
        delivered: true,
        seen: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: '2',
        conversationId: conversationId!,
        senderId: user?.id || '1',
        sender: user!,
        message: 'I\'m doing great! Thanks for asking 😊',
        isRead: true,
        delivered: true,
        seen: true,
        createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      },
      {
        id: '3',
        conversationId: conversationId!,
        senderId: user?.id === '1' ? '2' : '1',
        sender: mockUsers.find(u => u.id === (user?.id === '1' ? '2' : '1'))!,
        message: 'That\'s awesome! Want to grab coffee sometime?',
        isRead: true,
        delivered: true,
        seen: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
      },
    ];
    setMessages(mockMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !conversation || !user) return;

    const message: ExtendedDirectMessage = {
      id: Date.now().toString(),
      conversationId: conversation.id,
      senderId: user.id,
      sender: user,
      message: editingMessage ? newMessage : newMessage.trim(),
      isRead: false,
      delivered: true,
      seen: false,
      replyTo: replyingTo || undefined,
      edited: !!editingMessage,
      createdAt: new Date(),
    };

    if (editingMessage) {
      setMessages(prev => prev.map(msg => 
        msg.id === editingMessage.id 
          ? { ...msg, message: newMessage.trim(), edited: true }
          : msg
      ));
      setEditingMessage(null);
    } else {
      setMessages(prev => [...prev, message]);
    }

    setNewMessage('');
    setReplyingTo(null);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleMessageLongPress = (message: ExtendedDirectMessage, event: React.MouseEvent) => {
    setSelectedMessage(message);
    setMenuAnchor(event.currentTarget as HTMLElement);
  };

  const handleReaction = (emoji: string) => {
    if (!selectedMessage || !user) return;

    setMessages(prev => prev.map(msg => {
      if (msg.id === selectedMessage.id) {
        const reactions = msg.reactions || [];
        const existingReaction = reactions.find(r => r.emoji === emoji);
        
        if (existingReaction) {
          const hasUserReacted = existingReaction.users.includes(user.id);
          if (hasUserReacted) {
            existingReaction.users = existingReaction.users.filter(id => id !== user.id);
            if (existingReaction.users.length === 0) {
              return { ...msg, reactions: reactions.filter(r => r.emoji !== emoji) };
            }
          } else {
            existingReaction.users.push(user.id);
          }
        } else {
          reactions.push({ emoji, users: [user.id] });
        }
        
        return { ...msg, reactions: [...reactions] };
      }
      return msg;
    }));

    setMenuAnchor(null);
    setSelectedMessage(null);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && conversation && user) {
      // Simulate file upload
      const message: ExtendedDirectMessage = {
        id: Date.now().toString(),
        conversationId: conversation.id,
        senderId: user.id,
        sender: user,
        message: `📎 ${file.name}`,
        mediaUrl: URL.createObjectURL(file),
        mediaType: file.type.startsWith('image/') ? 'image' : 'video',
        isRead: false,
        delivered: true,
        seen: false,
        createdAt: new Date(),
      };

      setMessages(prev => [...prev, message]);
      toast.success('File uploaded successfully!');
    }
  };

  const formatMessageTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };

  const renderMessage = (message: ExtendedDirectMessage, index: number) => {
    const isOwnMessage = message.senderId === user?.id;
    const showAvatar = !isOwnMessage && (
      index === messages.length - 1 || 
      messages[index + 1]?.senderId !== message.senderId
    );
    const showTime = index === messages.length - 1 || 
      messages[index + 1]?.senderId !== message.senderId ||
      new Date(messages[index + 1]?.createdAt).getTime() - new Date(message.createdAt).getTime() > 5 * 60 * 1000;

    return (
      <Box
        key={message.id}
        sx={{
          display: 'flex',
          justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
          mb: 1,
          px: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, maxWidth: '70%' }}>
          {showAvatar && !isOwnMessage && (
            <Avatar
              src={message.sender.profilePicture}
              alt={message.sender.displayName}
              sx={{ width: 24, height: 24 }}
            >
              {message.sender.displayName?.charAt(0)}
            </Avatar>
          )}
          
          {!showAvatar && !isOwnMessage && <Box sx={{ width: 24 }} />}
          
          <Box>
            {message.replyTo && (
              <Paper
                sx={{
                  p: 1,
                  mb: 0.5,
                  backgroundColor: 'action.hover',
                  borderLeft: 3,
                  borderColor: 'primary.main',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Replying to {message.replyTo.sender.displayName}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  {message.replyTo.message}
                </Typography>
              </Paper>
            )}
            
            <Paper
              sx={{
                p: 1.5,
                backgroundColor: isOwnMessage ? 'primary.main' : 'background.paper',
                color: isOwnMessage ? 'primary.contrastText' : 'text.primary',
                borderRadius: 2,
                cursor: 'pointer',
                position: 'relative',
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                handleMessageLongPress(message, e);
              }}
            >
              {message.mediaUrl && (
                <Box sx={{ mb: message.message ? 1 : 0 }}>
                  {message.mediaType === 'image' ? (
                    <img
                      src={message.mediaUrl}
                      alt="Shared media"
                      style={{
                        maxWidth: '100%',
                        maxHeight: 200,
                        borderRadius: 8,
                      }}
                    />
                  ) : (
                    <video
                      src={message.mediaUrl}
                      controls
                      style={{
                        maxWidth: '100%',
                        maxHeight: 200,
                        borderRadius: 8,
                      }}
                    />
                  )}
                </Box>
              )}
              
              <Typography variant="body2">
                {message.message}
                {message.edited && (
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{ ml: 1, opacity: 0.7, fontStyle: 'italic' }}
                  >
                    (edited)
                  </Typography>
                )}
              </Typography>
              
              {message.reactions && message.reactions.length > 0 && (
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                  {message.reactions.map((reaction, idx) => (
                    <Chip
                      key={idx}
                      label={`${reaction.emoji} ${reaction.users.length}`}
                      size="small"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  ))}
                </Box>
              )}
            </Paper>
            
            {showTime && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {formatMessageTime(new Date(message.createdAt))}
                </Typography>
                {isOwnMessage && (
                  <Typography variant="caption" color="text.secondary">
                    {message.seen ? '✓✓' : message.delivered ? '✓' : '○'}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  if (!conversation) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading conversation...</Typography>
      </Box>
    );
  }

  const otherParticipants = conversation.participants.filter(p => p.id !== user?.id);
  const chatTitle = conversation.isGroup 
    ? conversation.groupName 
    : otherParticipants[0]?.displayName;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/messages')}>
            <ArrowBack />
          </IconButton>
          
          <Avatar
            src={conversation.isGroup ? conversation.groupImage : otherParticipants[0]?.profilePicture}
            alt={chatTitle}
            sx={{ width: 40, height: 40 }}
          >
            {chatTitle?.charAt(0)}
          </Avatar>
          
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {chatTitle}
            </Typography>
            {typingUsers.length > 0 ? (
              <Typography variant="caption" color="primary">
                {typingUsers.join(', ')} typing...
              </Typography>
            ) : (
              <Typography variant="caption" color="text.secondary">
                {conversation.isGroup 
                  ? `${conversation.participants.length} participants`
                  : 'Active now'
                }
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton>
            <Call />
          </IconButton>
          <IconButton>
            <VideoCall />
          </IconButton>
          <IconButton>
            <Info />
          </IconButton>
        </Box>
      </Paper>

      {/* Messages Area */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        {messages.map((message, index) => renderMessage(message, index))}
        
        {typingUsers.length > 0 && (
          <Box sx={{ px: 2, py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 24, height: 24 }}>
                {typingUsers[0]?.charAt(0)}
              </Avatar>
              <Box
                sx={{
                  display: 'flex',
                  gap: 0.5,
                  p: 1,
                  backgroundColor: 'action.hover',
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: 'text.secondary',
                    animation: 'pulse 1.4s ease-in-out infinite',
                  }}
                />
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: 'text.secondary',
                    animation: 'pulse 1.4s ease-in-out 0.2s infinite',
                  }}
                />
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: 'text.secondary',
                    animation: 'pulse 1.4s ease-in-out 0.4s infinite',
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Reply Preview */}
      {replyingTo && (
        <Paper sx={{ mx: 2, p: 1, backgroundColor: 'action.hover' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" color="primary">
                Replying to {replyingTo.sender.displayName}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {replyingTo.message}
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setReplyingTo(null)}>
              ✕
            </IconButton>
          </Box>
        </Paper>
      )}

      {/* Message Input */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 1,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <IconButton onClick={handleFileUpload}>
          <AttachFile />
        </IconButton>
        
        <IconButton>
          <PhotoCamera />
        </IconButton>
        
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder={editingMessage ? 'Edit message...' : 'Type a message...'}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
            },
          }}
        />
        
        <IconButton>
          <EmojiEmotions />
        </IconButton>
        
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <Send />
        </IconButton>
      </Paper>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelected}
        style={{ display: 'none' }}
      />

      {/* Message Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => {
          setMenuAnchor(null);
          setSelectedMessage(null);
        }}
      >
        <MenuItem onClick={() => handleReaction('❤️')}>❤️ Love</MenuItem>
        <MenuItem onClick={() => handleReaction('👍')}>👍 Like</MenuItem>
        <MenuItem onClick={() => handleReaction('😂')}>😂 Laugh</MenuItem>
        <MenuItem onClick={() => handleReaction('😮')}>😮 Wow</MenuItem>
        <MenuItem onClick={() => handleReaction('😢')}>😢 Sad</MenuItem>
        <MenuItem onClick={() => handleReaction('😡')}>😡 Angry</MenuItem>
        <Divider />
        <MenuItem onClick={() => setReplyingTo(selectedMessage)}>Reply</MenuItem>
        {selectedMessage?.senderId === user?.id && (
          <MenuItem onClick={() => {
            setEditingMessage(selectedMessage);
            setNewMessage(selectedMessage?.message || '');
            setMenuAnchor(null);
            setSelectedMessage(null);
          }}>
            Edit
          </MenuItem>
        )}
        <MenuItem>Forward</MenuItem>
        <MenuItem>Copy</MenuItem>
        {selectedMessage?.senderId === user?.id && (
          <MenuItem sx={{ color: 'error.main' }}>Delete</MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default ChatPage;