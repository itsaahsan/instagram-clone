import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { mockConversations } from '@/data/mockData';
import { Conversation } from '@/types';
import { useNavigate } from 'react-router-dom';

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [conversations] = useState<Conversation[]>(mockConversations);

  const handleConversationClick = (conversationId: string) => {
    navigate(`/messages/${conversationId}`);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Messages
        </Typography>
        <Button variant="contained">
          New Message
        </Button>
      </Box>

      {conversations.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Your messages
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Send private photos and messages to a friend or group.
            </Typography>
            <Button variant="contained">
              Send message
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <List>
            {conversations.map((conversation, index) => (
              <ListItem
                key={conversation.id}
                sx={{
                  cursor: 'pointer',
                  borderBottom: index < conversations.length - 1 ? 1 : 0,
                  borderColor: 'divider',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
                onClick={() => handleConversationClick(conversation.id)}
              >
                <ListItemAvatar>
                  {conversation.isGroup ? (
                    <Avatar src={conversation.groupImage} alt={conversation.groupName}>
                      {conversation.groupName?.charAt(0)}
                    </Avatar>
                  ) : (
                    <Avatar
                      src={conversation.participants[1]?.profilePicture}
                      alt={conversation.participants[1]?.displayName}
                    >
                      {conversation.participants[1]?.displayName?.charAt(0)}
                    </Avatar>
                  )}
                </ListItemAvatar>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {conversation.isGroup
                          ? conversation.groupName
                          : conversation.participants[1]?.displayName
                        }
                      </Typography>
                      {conversation.lastMessage && (
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
                        </Typography>
                      )}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: 200,
                        }}
                      >
                        {conversation.lastMessage?.message || 'No messages yet'}
                      </Typography>
                      {conversation.lastMessage && !conversation.lastMessage.isRead && (
                        <Badge
                          variant="dot"
                          color="primary"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Card>
      )}
    </Box>
  );
};

export default MessagesPage;