import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Badge,
  Switch,
  FormControlLabel,
  Grid,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  PersonAdd,
  ShoppingCart,
  Comment,
  Favorite,
  Share,
  PushPin,
  Block,
  Settings,
  Stop,
  People,
  Visibility,
  MonetizationOn,
  Gif,
} from '@mui/icons-material';
import { LiveStream, Product, Comment as CommentType, Badge as BadgeType, LiveStreamBadge } from '@/types';

interface LiveStreamingStudioProps {
  userId: string;
}

const LiveStreamingStudio: React.FC<LiveStreamingStudioProps> = ({ userId }) => {
  const [isLive, setIsLive] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [viewers, setViewers] = useState<any[]>([]);
  const [viewerCount, setViewerCount] = useState(0);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [pinnedComment, setPinnedComment] = useState<CommentType | null>(null);
  const [coHosts, setCoHosts] = useState<any[]>([]);
  const [isShopping, setIsShopping] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [badges, setBadges] = useState<LiveStreamBadge[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [commentModeration, setCommentModeration] = useState(false);
  const [slowMode, setSlowMode] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Mock data
  const availableBadges: BadgeType[] = [
    { id: '1', name: 'Heart', price: 1, currency: 'USD', icon: '❤️', color: '#ff4081' },
    { id: '2', name: 'Star', price: 5, currency: 'USD', icon: '⭐', color: '#ffc107' },
    { id: '3', name: 'Diamond', price: 10, currency: 'USD', icon: '💎', color: '#2196f3' },
  ];

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Premium Course',
      price: 99.99,
      currency: 'USD',
      image: '/images/course.jpg',
      url: 'https://example.com/course',
      merchant: 'Your Store',
      description: 'Complete course on live streaming',
      availability: 'in_stock',
    },
  ];

  useEffect(() => {
    if (isLive) {
      // Simulate viewer count changes
      const interval = setInterval(() => {
        setViewerCount(prev => Math.max(0, prev + Math.floor(Math.random() * 10) - 4));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isLive]);

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      streamRef.current = stream;
      setIsLive(true);
      setViewerCount(1);
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsLive(false);
    setViewerCount(0);
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const inviteCoHost = (user: any) => {
    setCoHosts([...coHosts, user]);
    setShowInviteDialog(false);
  };

  const removeCoHost = (userId: string) => {
    setCoHosts(coHosts.filter(host => host.id !== userId));
  };

  const pinComment = (comment: CommentType) => {
    setPinnedComment(comment);
  };

  const addProduct = (product: Product) => {
    setProducts([...products, product]);
    setShowProductDialog(false);
  };

  const StreamControls = () => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={isLive ? 'contained' : 'outlined'}
              color={isLive ? 'error' : 'primary'}
              onClick={isLive ? stopStream : startStream}
              startIcon={isLive ? <Stop /> : <Videocam />}
            >
              {isLive ? 'End Stream' : 'Go Live'}
            </Button>

            {isLive && (
              <>
                <IconButton
                  onClick={toggleVideo}
                  color={isVideoEnabled ? 'primary' : 'default'}
                >
                  {isVideoEnabled ? <Videocam /> : <VideocamOff />}
                </IconButton>

                <IconButton
                  onClick={toggleAudio}
                  color={isAudioEnabled ? 'primary' : 'default'}
                >
                  {isAudioEnabled ? <Mic /> : <MicOff />}
                </IconButton>

                <IconButton onClick={() => setShowInviteDialog(true)}>
                  <PersonAdd />
                </IconButton>

                <IconButton onClick={() => setShowSettingsDialog(true)}>
                  <Settings />
                </IconButton>
              </>
            )}
          </Box>

          {isLive && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Visibility color="primary" />
                <Typography variant="h6">{viewerCount}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MonetizationOn color="success" />
                <Typography variant="h6">${earnings.toFixed(2)}</Typography>
              </Box>

              <Chip
                label="LIVE"
                color="error"
                variant="filled"
                sx={{ animation: 'pulse 1.5s infinite' }}
              />
            </Box>
          )}
        </Box>

        {!isLive && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Stream Title"
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={streamDescription}
              onChange={(e) => setStreamDescription(e.target.value)}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={isShopping}
                  onChange={(e) => setIsShopping(e.target.checked)}
                />
              }
              label="Enable Shopping"
              sx={{ mt: 1 }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const VideoPreview = () => (
    <Card sx={{ mb: 2 }}>
      <Box sx={{ position: 'relative', paddingTop: '56.25%', bgcolor: 'black' }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Co-hosts overlay */}
        {coHosts.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: 'flex',
              gap: 1,
            }}
          >
            {coHosts.map((host) => (
              <Box
                key={host.id}
                sx={{
                  width: 120,
                  height: 80,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <Typography variant="caption">{host.displayName}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Stream info overlay */}
        {isLive && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              color: 'white',
            }}
          >
            <Typography variant="h6">{streamTitle}</Typography>
            <Typography variant="body2">{streamDescription}</Typography>
          </Box>
        )}
      </Box>
    </Card>
  );

  const LiveChat = () => (
    <Card sx={{ height: 400 }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Live Chat</Typography>
          <Badge badgeContent={comments.length} color="primary">
            <Comment />
          </Badge>
        </Box>

        {pinnedComment && (
          <Card sx={{ mb: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent sx={{ p: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PushPin fontSize="small" />
                <Typography variant="caption">Pinned</Typography>
              </Box>
              <Typography variant="body2">{pinnedComment.content}</Typography>
            </CardContent>
          </Card>
        )}

        <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
          {/* Chat messages would be rendered here */}
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Chat messages will appear here when you go live
          </Typography>
        </Box>

        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          disabled={!isLive}
        />
      </CardContent>
    </Card>
  );

  const ShoppingPanel = () => (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Shopping</Typography>
          <Button
            startIcon={<ShoppingCart />}
            onClick={() => setShowProductDialog(true)}
            disabled={!isLive}
          >
            Add Product
          </Button>
        </Box>

        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} key={product.id}>
              <Card variant="outlined">
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2">{product.name}</Typography>
                  <Typography variant="h6" color="primary">
                    ${product.price}
                  </Typography>
                  <Button size="small" variant="outlined" fullWidth sx={{ mt: 1 }}>
                    View Product
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  const BadgesPanel = () => (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Badges & Gifts
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {availableBadges.map((badge) => (
            <Chip
              key={badge.id}
              label={`${badge.icon} $${badge.price}`}
              variant="outlined"
              onClick={() => {
                // Handle badge purchase
                setEarnings(prev => prev + badge.price);
              }}
            />
          ))}
        </Box>

        <Typography variant="body2" color="text.secondary">
          Viewers can send badges to support your stream
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Live Streaming Studio
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <StreamControls />
          <VideoPreview />
          {isShopping && <ShoppingPanel />}
          <BadgesPanel />
        </Grid>

        <Grid item xs={12} md={4}>
          <LiveChat />
        </Grid>
      </Grid>

      {/* Invite Co-Host Dialog */}
      <Dialog
        open={showInviteDialog}
        onClose={() => setShowInviteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Invite Co-Host</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Search for users to invite..."
            sx={{ mb: 2 }}
          />
          {/* User search results would be displayed here */}
          <Typography variant="body2" color="text.secondary">
            Search for users to invite as co-hosts
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInviteDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog
        open={showProductDialog}
        onClose={() => setShowProductDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Product</DialogTitle>
        <DialogContent>
          <List>
            {mockProducts.map((product) => (
              <ListItem
                key={product.id}
                button
                onClick={() => addProduct(product)}
              >
                <ListItemAvatar>
                  <Avatar src={product.image} />
                </ListItemAvatar>
                <ListItemText
                  primary={product.name}
                  secondary={`$${product.price}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowProductDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Stream Settings Dialog */}
      <Dialog
        open={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Stream Settings</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Switch
                checked={commentModeration}
                onChange={(e) => setCommentModeration(e.target.checked)}
              />
            }
            label="Comment Moderation"
            sx={{ mb: 2, display: 'flex' }}
          />

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Slow Mode (seconds between messages)
          </Typography>
          <Slider
            value={slowMode}
            onChange={(_, value) => setSlowMode(value as number)}
            min={0}
            max={60}
            step={5}
            marks={[
              { value: 0, label: 'Off' },
              { value: 30, label: '30s' },
              { value: 60, label: '60s' },
            ]}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Stream Quality</InputLabel>
            <Select defaultValue="720p" label="Stream Quality">
              <MenuItem value="480p">480p</MenuItem>
              <MenuItem value="720p">720p</MenuItem>
              <MenuItem value="1080p">1080p</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettingsDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowSettingsDialog(false)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LiveStreamingStudio;