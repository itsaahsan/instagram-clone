import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  IconButton,
  Badge,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
} from '@mui/material';
import {
  Add,
  Send,
  Poll,
  Image,
  VideoCall,
  NotificationsActive,
  NotificationsOff,
  People,
  TrendingUp,
} from '@mui/icons-material';
import { BroadcastChannel, BroadcastMessage, Poll as PollType } from '@/types';

interface BroadcastChannelsProps {
  userId: string;
}

const BroadcastChannels: React.FC<BroadcastChannelsProps> = ({ userId }) => {
  const [channels, setChannels] = useState<BroadcastChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<BroadcastChannel | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDescription, setNewChannelDescription] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showPollDialog, setShowPollDialog] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  // Mock broadcast channels data
  const mockChannels: BroadcastChannel[] = [
    {
      id: '1',
      creatorId: 'creator1',
      creator: {
        id: 'creator1',
        username: 'tech_updates',
        email: 'tech@example.com',
        displayName: 'Tech Updates',
        profilePicture: '/images/tech_avatar.jpg',
        verified: true,
        private: false,
        followersCount: 50000,
        followingCount: 100,
        postsCount: 500,
        createdAt: new Date(),
        accountType: 'creator',
        twoFactorEnabled: true,
        closeFriends: [],
        restrictedUsers: [],
        mutedUsers: [],
        blockedUsers: [],
      },
      name: 'Tech News & Updates',
      description: 'Latest tech news, product launches, and industry insights',
      subscribersCount: 12500,
      messagesCount: 89,
      isSubscribed: true,
      messages: [
        {
          id: '1',
          channelId: '1',
          content: '🚀 New AI breakthrough announced! What do you think about the future of AI?',
          type: 'text',
          reactions: [
            {
              id: '1',
              userId: 'user1',
              user: {
                id: 'user1',
                username: 'alice',
                email: 'alice@example.com',
                displayName: 'Alice',
                profilePicture: '/images/alice.jpg',
                verified: false,
                private: false,
                followersCount: 1000,
                followingCount: 500,
                postsCount: 50,
                createdAt: new Date(),
                accountType: 'personal',
                twoFactorEnabled: false,
                closeFriends: [],
                restrictedUsers: [],
                mutedUsers: [],
                blockedUsers: [],
              },
              emoji: '🤖',
              createdAt: new Date(),
            },
          ],
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: '2',
          channelId: '1',
          content: 'Which smartphone feature matters most to you?',
          type: 'poll',
          poll: {
            id: 'poll1',
            question: 'Which smartphone feature matters most to you?',
            options: [
              { id: 'opt1', text: 'Camera Quality', votes: 45, percentage: 45 },
              { id: 'opt2', text: 'Battery Life', votes: 35, percentage: 35 },
              { id: 'opt3', text: 'Performance', votes: 20, percentage: 20 },
            ],
            totalVotes: 100,
            hasVoted: false,
          },
          reactions: [],
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        },
      ],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      creatorId: 'creator2',
      creator: {
        id: 'creator2',
        username: 'fitness_coach',
        email: 'fitness@example.com',
        displayName: 'Fitness Coach',
        profilePicture: '/images/fitness_avatar.jpg',
        verified: true,
        private: false,
        followersCount: 25000,
        followingCount: 200,
        postsCount: 300,
        createdAt: new Date(),
        accountType: 'creator',
        twoFactorEnabled: true,
        closeFriends: [],
        restrictedUsers: [],
        mutedUsers: [],
        blockedUsers: [],
      },
      name: 'Daily Fitness Tips',
      description: 'Daily workout tips, nutrition advice, and motivation',
      subscribersCount: 8750,
      messagesCount: 156,
      isSubscribed: false,
      messages: [],
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
  ];

  const handleCreateChannel = () => {
    const newChannel: BroadcastChannel = {
      id: Date.now().toString(),
      creatorId: userId,
      creator: mockChannels[0].creator, // Would be current user
      name: newChannelName,
      description: newChannelDescription,
      subscribersCount: 0,
      messagesCount: 0,
      isSubscribed: false,
      messages: [],
      createdAt: new Date(),
    };

    setChannels([newChannel, ...channels]);
    setNewChannelName('');
    setNewChannelDescription('');
    setShowCreateDialog(false);
  };

  const handleSubscribe = (channelId: string) => {
    // Toggle subscription status
    const updatedChannels = mockChannels.map(channel =>
      channel.id === channelId
        ? {
            ...channel,
            isSubscribed: !channel.isSubscribed,
            subscribersCount: channel.isSubscribed
              ? channel.subscribersCount - 1
              : channel.subscribersCount + 1,
          }
        : channel
    );
    // Update state logic would go here
  };

  const handleSendMessage = () => {
    if (!selectedChannel || !newMessage.trim()) return;

    const message: BroadcastMessage = {
      id: Date.now().toString(),
      channelId: selectedChannel.id,
      content: newMessage,
      type: 'text',
      reactions: [],
      createdAt: new Date(),
    };

    // Add message to channel
    selectedChannel.messages.unshift(message);
    setNewMessage('');
    setShowMessageDialog(false);
  };

  const handleCreatePoll = () => {
    if (!selectedChannel || !pollQuestion.trim()) return;

    const poll: PollType = {
      id: Date.now().toString(),
      question: pollQuestion,
      options: pollOptions
        .filter(opt => opt.trim())
        .map((opt, index) => ({
          id: `opt${index}`,
          text: opt.trim(),
          votes: 0,
          percentage: 0,
        })),
      totalVotes: 0,
      hasVoted: false,
    };

    const message: BroadcastMessage = {
      id: Date.now().toString(),
      channelId: selectedChannel.id,
      content: pollQuestion,
      type: 'poll',
      poll,
      reactions: [],
      createdAt: new Date(),
    };

    selectedChannel.messages.unshift(message);
    setPollQuestion('');
    setPollOptions(['', '']);
    setShowPollDialog(false);
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const ChannelCard: React.FC<{ channel: BroadcastChannel }> = ({ channel }) => (
    <Card sx={{ mb: 2, cursor: 'pointer' }} onClick={() => setSelectedChannel(channel)}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={channel.creator.profilePicture}
            alt={channel.creator.displayName}
            sx={{ width: 50, height: 50 }}
          />
          
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {channel.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  by {channel.creator.displayName}
                  {channel.creator.verified && (
                    <Chip label="Verified" size="small" color="primary" sx={{ ml: 1 }} />
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {channel.description}
                </Typography>
              </Box>
              
              <Button
                variant={channel.isSubscribed ? 'outlined' : 'contained'}
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubscribe(channel.id);
                }}
                startIcon={channel.isSubscribed ? <NotificationsOff /> : <NotificationsActive />}
              >
                {channel.isSubscribed ? 'Subscribed' : 'Subscribe'}
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <People fontSize="small" color="action" />
                <Typography variant="caption">
                  {channel.subscribersCount.toLocaleString()} subscribers
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {channel.messagesCount} messages
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const MessageItem: React.FC<{ message: BroadcastMessage }> = ({ message }) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body1" sx={{ mb: 1 }}>
        {message.content}
      </Typography>
      
      {message.type === 'poll' && message.poll && (
        <Card sx={{ mt: 1, bgcolor: 'background.default' }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
              {message.poll.question}
            </Typography>
            
            <FormControl component="fieldset" fullWidth>
              <RadioGroup>
                {message.poll.options.map((option) => (
                  <Box key={option.id} sx={{ mb: 1 }}>
                    <FormControlLabel
                      value={option.id}
                      control={<Radio size="small" />}
                      label={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          <Typography variant="body2">{option.text}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.votes} ({option.percentage}%)
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                    <LinearProgress
                      variant="determinate"
                      value={option.percentage}
                      sx={{ mt: 0.5, height: 4, borderRadius: 1 }}
                    />
                  </Box>
                ))}
              </RadioGroup>
            </FormControl>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {message.poll.totalVotes} total votes
            </Typography>
          </CardContent>
        </Card>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {message.createdAt.toLocaleDateString()} at {message.createdAt.toLocaleTimeString()}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {message.reactions.map((reaction, index) => (
            <Chip
              key={index}
              label={`${reaction.emoji} ${message.reactions.filter(r => r.emoji === reaction.emoji).length}`}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 2 }}>
      {!selectedChannel ? (
        <>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              Broadcast Channels
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowCreateDialog(true)}
            >
              Create Channel
            </Button>
          </Box>

          {/* Channels List */}
          <Box>
            {[...mockChannels, ...channels].map((channel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </Box>
        </>
      ) : (
        <>
          {/* Channel Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button variant="outlined" onClick={() => setSelectedChannel(null)}>
                ← Back
              </Button>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {selectedChannel.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedChannel.subscribersCount.toLocaleString()} subscribers
                </Typography>
              </Box>
            </Box>
            
            {selectedChannel.creatorId === userId && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Poll />}
                  onClick={() => setShowPollDialog(true)}
                >
                  Poll
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Send />}
                  onClick={() => setShowMessageDialog(true)}
                >
                  Message
                </Button>
              </Box>
            )}
          </Box>

          {/* Messages */}
          <Box>
            {selectedChannel.messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
            
            {selectedChannel.messages.length === 0 && (
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                No messages yet. Be the first to share something!
              </Typography>
            )}
          </Box>
        </>
      )}

      {/* Create Channel Dialog */}
      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Broadcast Channel</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Channel Name"
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={newChannelDescription}
            onChange={(e) => setNewChannelDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateChannel}
            variant="contained"
            disabled={!newChannelName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send Message Dialog */}
      <Dialog
        open={showMessageDialog}
        onClose={() => setShowMessageDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Send Message</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="What would you like to share with your subscribers?"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMessageDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSendMessage}
            variant="contained"
            disabled={!newMessage.trim()}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Poll Dialog */}
      <Dialog
        open={showPollDialog}
        onClose={() => setShowPollDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Poll</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Poll Question"
            value={pollQuestion}
            onChange={(e) => setPollQuestion(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Options:
          </Typography>
          
          {pollOptions.map((option, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => updatePollOption(index, e.target.value)}
              />
              {pollOptions.length > 2 && (
                <Button
                  color="error"
                  onClick={() => removePollOption(index)}
                >
                  Remove
                </Button>
              )}
            </Box>
          ))}
          
          <Button onClick={addPollOption} sx={{ mt: 1 }}>
            Add Option
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPollDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreatePoll}
            variant="contained"
            disabled={!pollQuestion.trim() || pollOptions.filter(opt => opt.trim()).length < 2}
          >
            Create Poll
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BroadcastChannels;