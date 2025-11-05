import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Avatar,
  Paper,
  TextField,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Fab,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  Chat,
  Share,
  MoreVert,
  Send,
  PersonAdd,
  Block,
  Report,
  Favorite,
  Close,
  Settings,
  PushPin,
  Delete,
  ShoppingCart,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';
import { mockUsers } from '@/data/mockData';

interface LiveComment {
  id: string;
  user: User;
  message: string;
  timestamp: Date;
  isPinned?: boolean;
}

interface LiveStreamProps {
  isHost?: boolean;
  streamTitle?: string;
  viewers: User[];
  comments: LiveComment[];
  onStartStream?: () => void;
  onEndStream?: () => void;
  onSendComment?: (message: string) => void;
  onInviteGuest?: (userId: string) => void;
  onPinComment?: (commentId: string) => void;
  onDeleteComment?: (commentId: string) => void;
}

const LiveStream: React.FC<LiveStreamProps> = ({
  isHost = false,
  streamTitle = "Live Video",
  viewers = [],
  comments = [],
  onStartStream,
  onEndStream,
  onSendComment,
  onInviteGuest,
  onPinComment,
  onDeleteComment,
}) => {
  const { user } = useAuth();
  const [isStreaming, setIsStreaming] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [showShoppingDialog, setShowShoppingDialog] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedComment, setSelectedComment] = useState<LiveComment | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isHost && isStreaming) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isHost, isStreaming]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleStartStream = () => {
    setIsStreaming(true);
    onStartStream?.();
  };

  const handleEndStream = () => {
    setIsStreaming(false);
    stopCamera();
    onEndStream?.();
  };

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const handleSendComment = () => {
    if (newComment.trim()) {
      onSendComment?.(newComment);
      setNewComment('');
    }
  };

  const handleCommentAction = (comment: LiveComment, action: string) => {
    switch (action) {
      case 'pin':
        onPinComment?.(comment.id);
        break;
      case 'delete':
        onDeleteComment?.(comment.id);
        break;
    }
    setMenuAnchor(null);
    setSelectedComment(null);
  };

  const formatViewerCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={user?.profilePicture} alt={user?.displayName}>
            {user?.displayName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6">{streamTitle}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Badge
                badgeContent="LIVE"
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.6rem',
                    height: 16,
                    minWidth: 32,
                  },
                }}
              >
                <Box />
              </Badge>
              <Typography variant="body2" color="text.secondary">
                {formatViewerCount(viewers.length)} viewers
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => setShowComments(!showComments)}>
            <Chat />
          </IconButton>
          <IconButton>
            <Share />
          </IconButton>
          {isHost && (
            <>
              <IconButton onClick={() => setShowGuestDialog(true)}>
                <PersonAdd />
              </IconButton>
              <IconButton onClick={() => setShowShoppingDialog(true)}>
                <ShoppingCart />
              </IconButton>
            </>
          )}
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Video Area */}
        <Box sx={{ flex: 1, position: 'relative', bgcolor: 'black' }}>
          {isHost ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <Typography variant="h4">Live Stream Viewer</Typography>
            </Box>
          )}

          {/* Stream Controls */}
          {isHost && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 2,
              }}
            >
              <Fab
                color={isCameraOn ? 'primary' : 'error'}
                onClick={toggleCamera}
                size="medium"
              >
                {isCameraOn ? <Videocam /> : <VideocamOff />}
              </Fab>
              <Fab
                color={isMicOn ? 'primary' : 'error'}
                onClick={toggleMic}
                size="medium"
              >
                {isMicOn ? <Mic /> : <MicOff />}
              </Fab>
              {!isStreaming ? (
                <Fab
                  color="error"
                  onClick={handleStartStream}
                  size="large"
                  variant="extended"
                >
                  <Videocam sx={{ mr: 1 }} />
                  Go Live
                </Fab>
              ) : (
                <Fab
                  color="error"
                  onClick={handleEndStream}
                  size="medium"
                >
                  <Close />
                </Fab>
              )}
            </Box>
          )}

          {/* Viewer Avatars */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              maxHeight: '50%',
              overflow: 'hidden',
            }}
          >
            {viewers.slice(0, 10).map((viewer) => (
              <Avatar
                key={viewer.id}
                src={viewer.profilePicture}
                alt={viewer.displayName}
                sx={{ width: 32, height: 32, border: '2px solid white' }}
              >
                {viewer.displayName?.charAt(0)}
              </Avatar>
            ))}
            {viewers.length > 10 && (
              <Typography
                variant="caption"
                sx={{
                  color: 'white',
                  textAlign: 'center',
                  bgcolor: 'rgba(0,0,0,0.6)',
                  borderRadius: 1,
                  px: 1,
                }}
              >
                +{viewers.length - 10}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Comments Sidebar */}
        {showComments && (
          <Paper
            sx={{
              width: 350,
              display: 'flex',
              flexDirection: 'column',
              borderLeft: 1,
              borderColor: 'divider',
            }}
          >
            {/* Comments Header */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">Live Chat</Typography>
            </Box>

            {/* Comments List */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
              {comments.map((comment) => (
                <Box
                  key={comment.id}
                  sx={{
                    p: 1,
                    mb: 1,
                    borderRadius: 1,
                    bgcolor: comment.isPinned ? 'action.selected' : 'transparent',
                    position: 'relative',
                  }}
                >
                  {comment.isPinned && (
                    <PushPin
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        fontSize: 16,
                        color: 'primary.main',
                      }}
                    />
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Avatar
                      src={comment.user.profilePicture}
                      alt={comment.user.displayName}
                      sx={{ width: 24, height: 24 }}
                    >
                      {comment.user.displayName?.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" fontWeight="bold">
                      {comment.user.displayName}
                    </Typography>
                    {isHost && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          setMenuAnchor(e.currentTarget);
                          setSelectedComment(comment);
                        }}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                  
                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                    {comment.message}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Comment Input */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Say something..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendComment();
                    }
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={handleSendComment}
                  disabled={!newComment.trim()}
                >
                  <Send />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>

      {/* Comment Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        {selectedComment && !selectedComment.isPinned && (
          <MenuItem onClick={() => handleCommentAction(selectedComment, 'pin')}>
            <PushPin sx={{ mr: 1 }} />
            Pin Comment
          </MenuItem>
        )}
        <MenuItem onClick={() => selectedComment && handleCommentAction(selectedComment, 'delete')}>
          <Delete sx={{ mr: 1 }} />
          Delete Comment
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <Block sx={{ mr: 1 }} />
          Block User
        </MenuItem>
      </Menu>

      {/* Guest Invitation Dialog */}
      <Dialog open={showGuestDialog} onClose={() => setShowGuestDialog(false)}>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Invite Guest
          </Typography>
          <List>
            {mockUsers.slice(0, 5).map((user) => (
              <ListItem
                key={user.id}
                button
                onClick={() => {
                  onInviteGuest?.(user.id);
                  setShowGuestDialog(false);
                }}
              >
                <ListItemAvatar>
                  <Avatar src={user.profilePicture} alt={user.displayName}>
                    {user.displayName?.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.displayName}
                  secondary={`@${user.username}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowGuestDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Shopping Dialog */}
      <Dialog open={showShoppingDialog} onClose={() => setShowShoppingDialog(false)}>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Live Shopping
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add products to showcase during your live stream.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" fullWidth>
              Add Product
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowShoppingDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LiveStream;