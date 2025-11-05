import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Badge,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  VideoCall,
  Call,
  Send,
  Image,
  Mic,
  EmojiEmotions,
  VisibilityOff,
  Star,
  DeleteSweep,
  VolumeOff,
  Archive,
} from '@mui/icons-material';
import { Conversation, DirectMessage, Note } from '@/types';
import Notes from '@/components/social/Notes';
import BroadcastChannels from '@/components/social/BroadcastChannels';

interface EnhancedMessagingProps {
  userId: string;
}

const EnhancedMessaging: React.FC<EnhancedMessagingProps> = ({ userId }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [vanishMode, setVanishMode] = useState(false);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [showChannelsDialog, setShowChannelsDialog] = useState(false);

  // Mock conversations with enhanced features
  const conversations: Conversation[] = [
    {
      id: '1',
      participants: [
        {
          id: 'user1',
          username: 'alice_wonder',
          email: 'alice@example.com',
          displayName: 'Alice Wonder',
          profilePicture: '/images/alice.jpg',
          verified: true,
          private: false,
          followersCount: 10000,
          followingCount: 1000,
          postsCount: 500,
          createdAt: new Date(),
          lastSeen: new Date(),
          accountType: 'creator',
          twoFactorEnabled: false,
          closeFriends: [],
          restrictedUsers: [],
          mutedUsers: [],
          blockedUsers: [],
        }
      ],
      lastMessage: {
        id: '1',
        conversationId: 'conv1',
        senderId: 'user1',
        sender: {
          id: 'user1',
          username: 'alice_wonder',
          email: 'alice@example.com',
          displayName: 'Alice Wonder',
          profilePicture: '/images/alice.jpg',
          verified: true,
          private: false,
          followersCount: 10000,
          followingCount: 1000,
          postsCount: 500,
          createdAt: new Date(),
          lastSeen: new Date(),
          accountType: 'creator',
          twoFactorEnabled: false,
          closeFriends: [],
          restrictedUsers: [],
          mutedUsers: [],
          blockedUsers: [],
        },
        message: 'Hey! Check out my latest post 📸',
        isRead: false,
        createdAt: new Date(),
      },
      isGroup: false,
      isVanishMode: false,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  const ConversationItem: React.FC<{ conversation: Conversation }> = ({ conversation }) => {
    const otherParticipant = conversation.participants[0];
    const hasUnread = Math.random() > 0.5; // Mock unread status
    
    return (
      <ListItem button>
        <ListItemAvatar>
          <Badge
            variant="dot"
            color="success"
            invisible={!hasUnread}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Avatar src={otherParticipant.profilePicture} />
          </Badge>
        </ListItemAvatar>
        
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={hasUnread ? 'bold' : 'normal'}>
                {otherParticipant.displayName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {conversation.lastMessage?.createdAt.toLocaleTimeString() || ''}
              </Typography>
            </Box>
          }
          secondary={
            <Box>
              <Typography
                variant="body2"
                color={hasUnread ? 'text.primary' : 'text.secondary'}
                fontWeight={hasUnread ? 'bold' : 'normal'}
                noWrap
              >
                {conversation.lastMessage?.message || 'No message'}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                {conversation.isVanishMode && (
                  <Chip label="Vanish Mode" size="small" color="secondary" />
                )}
                {conversation.mutedUntil && (
                  <Chip icon={<VolumeOff />} label="Muted" size="small" />
                )}
                {conversation.isArchived && (
                  <Chip icon={<Archive />} label="Archived" size="small" />
                )}
              </Box>
            </Box>
          }
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <IconButton size="small">
            <VideoCall />
          </IconButton>
          <IconButton size="small">
            <Call />
          </IconButton>
        </Box>
      </ListItem>
    );
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold">
            Messages
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowNotesDialog(true)}
              startIcon={<Star />}
            >
              Notes
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowChannelsDialog(true)}
            >
              Channels
            </Button>
          </Box>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Chip label="Primary" variant="filled" color="primary" />
          <Chip label="General" variant="outlined" />
          <Chip label="Requests" variant="outlined" />
        </Box>
      </Box>

      {/* Conversations List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List>
          {conversations.map((conversation) => (
            <ConversationItem key={conversation.id} conversation={conversation} />
          ))}
        </List>
      </Box>

      {/* Enhanced Features Panel */}
      <Card sx={{ m: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Message Features
          </Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={vanishMode}
                onChange={(e) => setVanishMode(e.target.checked)}
                size="small"
              />
            }
            label="Vanish Mode"
            sx={{ mb: 1 }}
          />
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small" color="primary">
              <Image />
            </IconButton>
            <IconButton size="small" color="primary">
              <Mic />
            </IconButton>
            <IconButton size="small" color="primary">
              <EmojiEmotions />
            </IconButton>
            <IconButton size="small" color="primary">
              <VisibilityOff />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* Notes Dialog */}
      <Dialog
        open={showNotesDialog}
        onClose={() => setShowNotesDialog(false)}
        maxWidth="md"
        fullWidth
        fullScreen
      >
        <Notes userId={userId} />
      </Dialog>

      {/* Broadcast Channels Dialog */}
      <Dialog
        open={showChannelsDialog}
        onClose={() => setShowChannelsDialog(false)}
        maxWidth="md"
        fullWidth
        fullScreen
      >
        <BroadcastChannels userId={userId} />
      </Dialog>
    </Box>
  );
};

export default EnhancedMessaging;