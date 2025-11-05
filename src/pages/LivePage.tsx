import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  Chat,
  Share,
  MoreVert,
  Close,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { mockUsers } from '@/data/mockData';
import { User } from '@/types';
import toast from 'react-hot-toast';

interface LiveStream {
  id: string;
  user: User;
  title: string;
  viewersCount: number;
  isLive: boolean;
  startedAt: Date;
  viewers: User[];
}

interface LiveComment {
  id: string;
  user: User;
  message: string;
  timestamp: Date;
}

const LivePage: React.FC = () => {
  const { user } = useAuth();
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [startStreamDialog, setStartStreamDialog] = useState(false);
  
  // Mock live stream data
  const [currentStream, setCurrentStream] = useState<LiveStream | null>(null);
  const [liveComments, setLiveComments] = useState<LiveComment[]>([]);
  const [, setViewersList] = useState<User[]>([]);

  useEffect(() => {
    if (isStreaming && currentStream) {
      // Simulate live comments
      const interval = setInterval(() => {
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        const messages = [
          'Hello!', 'Great stream!', '👏👏👏', 'Amazing content!', 
          'Love this!', 'Keep it up!', '🔥🔥🔥', 'So cool!'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        const newComment: LiveComment = {
          id: Date.now().toString(),
          user: randomUser,
          message: randomMessage,
          timestamp: new Date(),
        };
        
        setLiveComments(prev => [newComment, ...prev.slice(0, 49)]); // Keep last 50 comments
      }, 3000 + Math.random() * 5000); // Random interval 3-8 seconds

      // Simulate viewer count changes
      const viewerInterval = setInterval(() => {
        setCurrentStream(prev => prev ? {
          ...prev,
          viewersCount: prev.viewersCount + Math.floor(Math.random() * 10) - 5
        } : null);
      }, 5000);

      return () => {
        clearInterval(interval);
        clearInterval(viewerInterval);
      };
    }
  }, [isStreaming, currentStream]);

  const handleStartStream = () => {
    if (!streamTitle.trim()) {
      toast.error('Please enter a stream title');
      return;
    }

    const newStream: LiveStream = {
      id: Date.now().toString(),
      user: user!,
      title: streamTitle,
      viewersCount: 0,
      isLive: true,
      startedAt: new Date(),
      viewers: [],
    };

    setCurrentStream(newStream);
    setIsStreaming(true);
    setStartStreamDialog(false);
    setViewersList(mockUsers.slice(0, 10));
    toast.success('Live stream started!');
  };

  const handleEndStream = () => {
    setIsStreaming(false);
    setCurrentStream(null);
    setLiveComments([]);
    setViewersList([]);
    toast.success('Live stream ended');
  };

  const handleSendComment = () => {
    if (!newComment.trim() || !user) return;

    const comment: LiveComment = {
      id: Date.now().toString(),
      user: user,
      message: newComment.trim(),
      timestamp: new Date(),
    };

    setLiveComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const formatDuration = (startTime: Date) => {
    const diff = Date.now() - startTime.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isStreaming && !currentStream) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <Typography variant="h4" fontWeight={600} sx={{ mb: 3, textAlign: 'center' }}>
          Go Live
        </Typography>

        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <Videocam sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Start your live video
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Share your moments with your followers in real-time
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              startIcon={<Videocam />}
              onClick={() => setStartStreamDialog(true)}
              sx={{ px: 4, py: 1.5 }}
            >
              Go Live
            </Button>
          </CardContent>
        </Card>

        {/* Start Stream Dialog */}
        <Dialog 
          open={startStreamDialog} 
          onClose={() => setStartStreamDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Start Live Stream</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Stream Title"
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
              placeholder="What's your stream about?"
              sx={{ mt: 2 }}
            />
            
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant={isVideoEnabled ? 'contained' : 'outlined'}
                startIcon={isVideoEnabled ? <Videocam /> : <VideocamOff />}
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              >
                {isVideoEnabled ? 'Video On' : 'Video Off'}
              </Button>
              
              <Button
                variant={isAudioEnabled ? 'contained' : 'outlined'}
                startIcon={isAudioEnabled ? <Mic /> : <MicOff />}
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              >
                {isAudioEnabled ? 'Audio On' : 'Audio Off'}
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStartStreamDialog(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleStartStream}>
              Start Stream
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Stream Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          backgroundColor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={user?.profilePicture} alt={user?.displayName}>
            {user?.displayName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {currentStream?.title || 'Live Stream'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label="LIVE"
                color="error"
                size="small"
                sx={{ animation: 'pulse 2s infinite' }}
              />
              <Typography variant="body2" color="text.secondary">
                {currentStream && formatDuration(currentStream.startedAt)}
              </Typography>
              <Badge badgeContent={currentStream?.viewersCount || 0} color="primary">
                <Typography variant="body2" color="text.secondary">
                  viewers
                </Typography>
              </Badge>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => setShowChat(!showChat)}>
            <Chat />
          </IconButton>
          <IconButton>
            <Share />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
          <Button
            variant="contained"
            color="error"
            onClick={handleEndStream}
            startIcon={<Close />}
          >
            End Stream
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Video Area */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Simulated Video Stream */}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${user?.profilePicture || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(20px)',
              opacity: 0.3,
            }}
          />
          
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: 'white',
            }}
          >
            <Avatar
              src={user?.profilePicture}
              alt={user?.displayName}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            >
              {user?.displayName?.charAt(0)}
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              {user?.displayName}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              is live now
            </Typography>
          </Box>

          {/* Stream Controls */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 2,
            }}
          >
            <IconButton
              sx={{ backgroundColor: 'rgba(0,0,0,0.5)', color: 'white' }}
              onClick={() => setIsVideoEnabled(!isVideoEnabled)}
            >
              {isVideoEnabled ? <Videocam /> : <VideocamOff />}
            </IconButton>
            <IconButton
              sx={{ backgroundColor: 'rgba(0,0,0,0.5)', color: 'white' }}
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            >
              {isAudioEnabled ? <Mic /> : <MicOff />}
            </IconButton>
          </Box>
        </Box>

        {/* Chat Sidebar */}
        {showChat && (
          <Box
            sx={{
              width: 350,
              backgroundColor: 'background.paper',
              borderLeft: 1,
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Chat Header */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Live Chat
              </Typography>
            </Box>

            {/* Comments List */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
              <List dense>
                {liveComments.map((comment) => (
                  <ListItem key={comment.id} sx={{ py: 0.5 }}>
                    <ListItemAvatar>
                      <Avatar
                        src={comment.user.profilePicture}
                        alt={comment.user.displayName}
                        sx={{ width: 24, height: 24 }}
                      >
                        {comment.user.displayName?.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          <strong>{comment.user.displayName}</strong>{' '}
                          {comment.message}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Chat Input */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Say something..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                />
                <IconButton
                  color="primary"
                  onClick={handleSendComment}
                  disabled={!newComment.trim()}
                >
                  <Chat />
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LivePage;