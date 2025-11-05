import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogContent,
  Card,
  CardContent,
  Slider,
  TextField,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Close,
  PhotoCamera,
  Videocam,
  MusicNote,
  EmojiEmotions,
  Poll,
  QuestionAnswer,
  LocationOn,
  Tag,
  Palette,
  FilterVintage,
  Timer,
  GroupAdd,
  Public,
  Lock,
  Favorite,
} from '@mui/icons-material';
import { Story, StorySticker, MusicTrack, Location, User } from '@/types';

interface EnhancedStoryCreatorProps {
  onSave: (storyData: any) => void;
  onCancel: () => void;
  userId: string;
}

const EnhancedStoryCreator: React.FC<EnhancedStoryCreatorProps> = ({ onSave, onCancel, userId }) => {
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [stickers, setStickers] = useState<StorySticker[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<MusicTrack | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [textOverlay, setTextOverlay] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textSize, setTextSize] = useState(24);
  const [isCloseFriends, setIsCloseFriends] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [taggedUsers, setTaggedUsers] = useState<User[]>([]);
  const [showStickerDialog, setShowStickerDialog] = useState(false);
  const [showMusicDialog, setShowMusicDialog] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showUserTagDialog, setShowUserTagDialog] = useState(false);
  const [currentSticker, setCurrentSticker] = useState<string>('');
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock data
  const musicTracks: MusicTrack[] = [
    {
      id: '1',
      title: 'Trending Beat',
      artist: 'Popular Artist',
      url: '/audio/trending.mp3',
      duration: 30,
      isOriginal: false,
      usageCount: 100000,
      trending: true,
    },
    {
      id: '2',
      title: 'Chill Vibes',
      artist: 'Ambient Music',
      url: '/audio/chill.mp3',
      duration: 45,
      isOriginal: false,
      usageCount: 50000,
    },
  ];

  const locations: Location[] = [
    {
      id: '1',
      name: 'Central Park',
      address: 'New York, NY',
      coordinates: { lat: 40.785091, lng: -73.968285 },
      postCount: 1500000,
    },
    {
      id: '2',
      name: 'Times Square',
      address: 'New York, NY',
      coordinates: { lat: 40.758896, lng: -73.985130 },
      postCount: 2000000,
    },
  ];

  const suggestedUsers: User[] = [
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
      accountType: 'creator',
      twoFactorEnabled: false,
      closeFriends: [],
      restrictedUsers: [],
      mutedUsers: [],
      blockedUsers: [],
    },
  ];

  const stickerTypes = [
    { type: 'poll', icon: <Poll />, label: 'Poll' },
    { type: 'question', icon: <QuestionAnswer />, label: 'Question' },
    { type: 'music', icon: <MusicNote />, label: 'Music' },
    { type: 'location', icon: <LocationOn />, label: 'Location' },
    { type: 'mention', icon: <Tag />, label: 'Mention' },
    { type: 'emoji', icon: <EmojiEmotions />, label: 'Emoji' },
    { type: 'gif', icon: <Palette />, label: 'GIF' },
  ];

  const backgroundColors = [
    '#000000', '#ffffff', '#ff6b6b', '#4ecdc4', '#45b7d1', 
    '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'
  ];

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
      setMediaType(file.type.startsWith('video') ? 'video' : 'photo');
    }
  };

  const addSticker = (type: string, data: any, position: { x: number; y: number }) => {
    const newSticker: StorySticker = {
      id: Date.now().toString(),
      type: type as any,
      position,
      data,
    };
    setStickers([...stickers, newSticker]);
  };

  const createPollSticker = () => {
    const pollData = {
      question: 'Your poll question',
      options: ['Option 1', 'Option 2'],
    };
    addSticker('poll', pollData, { x: 50, y: 50 });
    setShowStickerDialog(false);
  };

  const createQuestionSticker = () => {
    const questionData = {
      text: 'Ask me a question',
    };
    addSticker('question', questionData, { x: 50, y: 70 });
    setShowStickerDialog(false);
  };

  const addLocationSticker = (location: Location) => {
    setSelectedLocation(location);
    addSticker('location', location, { x: 20, y: 80 });
    setShowLocationDialog(false);
  };

  const addUserMention = (user: User) => {
    setTaggedUsers([...taggedUsers, user]);
    addSticker('mention', user, { x: 30, y: 60 });
    setShowUserTagDialog(false);
  };

  const handleSave = () => {
    const storyData = {
      mediaUrl,
      mediaType,
      stickers,
      music: selectedMusic,
      backgroundColor,
      textOverlay,
      textColor,
      textSize,
      filters,
      isCloseFriends,
      location: selectedLocation,
      taggedUsers,
      duration: mediaType === 'video' ? 15 : undefined,
    };
    onSave(storyData);
  };

  const StickerDialog = () => (
    <Dialog open={showStickerDialog} onClose={() => setShowStickerDialog(false)} maxWidth="sm" fullWidth>
      <DialogContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Add Sticker
        </Typography>
        <Grid container spacing={2}>
          {stickerTypes.map((sticker) => (
            <Grid item xs={6} sm={4} key={sticker.type}>
              <Card
                sx={{ cursor: 'pointer', textAlign: 'center' }}
                onClick={() => {
                  if (sticker.type === 'poll') createPollSticker();
                  else if (sticker.type === 'question') createQuestionSticker();
                  else if (sticker.type === 'music') setShowMusicDialog(true);
                  else if (sticker.type === 'location') setShowLocationDialog(true);
                  else if (sticker.type === 'mention') setShowUserTagDialog(true);
                }}
              >
                <CardContent>
                  {sticker.icon}
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    {sticker.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <IconButton onClick={onCancel}>
          <Close />
        </IconButton>
        <Typography variant="h6">Create Story</Typography>
        <Button onClick={handleSave} disabled={!mediaUrl && !textOverlay}>
          Share
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, position: 'relative', bgcolor: backgroundColor }}>
        {/* Media Display */}
        {mediaUrl ? (
          mediaType === 'video' ? (
            <video
              src={mediaUrl}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px)`,
              }}
              controls
            />
          ) : (
            <img
              src={mediaUrl}
              alt="Story content"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px)`,
              }}
            />
          )
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <Typography variant="h4" textAlign="center" sx={{ color: textColor, fontSize: textSize }}>
              {textOverlay || 'Tap to add media or text'}
            </Typography>
          </Box>
        )}

        {/* Stickers Overlay */}
        {stickers.map((sticker) => (
          <Box
            key={sticker.id}
            sx={{
              position: 'absolute',
              left: `${sticker.position.x}%`,
              top: `${sticker.position.y}%`,
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              p: 1,
              borderRadius: 1,
              fontSize: '12px',
            }}
          >
            {sticker.type === 'poll' && `Poll: ${sticker.data.question}`}
            {sticker.type === 'question' && sticker.data.text}
            {sticker.type === 'location' && sticker.data.name}
            {sticker.type === 'mention' && `@${sticker.data.username}`}
          </Box>
        ))}

        {/* Privacy Indicator */}
        {isCloseFriends && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              bgcolor: 'success.main',
              color: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Favorite fontSize="small" />
            <Typography variant="caption">Close Friends</Typography>
          </Box>
        )}
      </Box>

      {/* Bottom Tools */}
      <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
        {/* Media Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleMediaUpload}
            accept="image/*,video/*"
            style={{ display: 'none' }}
          />
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            sx={{ bgcolor: 'primary.main', color: 'white' }}
          >
            <PhotoCamera />
          </IconButton>
          <IconButton
            onClick={() => setShowStickerDialog(true)}
            sx={{ bgcolor: 'secondary.main', color: 'white' }}
          >
            <EmojiEmotions />
          </IconButton>
          <IconButton
            onClick={() => setShowMusicDialog(true)}
            sx={{ bgcolor: 'success.main', color: 'white' }}
          >
            <MusicNote />
          </IconButton>
        </Box>

        {/* Text Overlay */}
        <TextField
          fullWidth
          placeholder="Add text to your story..."
          value={textOverlay}
          onChange={(e) => setTextOverlay(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Background Colors */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, justifyContent: 'center' }}>
          {backgroundColors.map((color) => (
            <Box
              key={color}
              sx={{
                width: 30,
                height: 30,
                bgcolor: color,
                borderRadius: '50%',
                cursor: 'pointer',
                border: backgroundColor === color ? '3px solid white' : '1px solid gray',
              }}
              onClick={() => setBackgroundColor(color)}
            />
          ))}
        </Box>

        {/* Filters */}
        {mediaUrl && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" gutterBottom>
              Filters
            </Typography>
            <Typography variant="caption">Brightness</Typography>
            <Slider
              value={filters.brightness}
              onChange={(_, value) => setFilters({ ...filters, brightness: value as number })}
              min={50}
              max={150}
              size="small"
            />
            <Typography variant="caption">Contrast</Typography>
            <Slider
              value={filters.contrast}
              onChange={(_, value) => setFilters({ ...filters, contrast: value as number })}
              min={50}
              max={150}
              size="small"
            />
          </Box>
        )}

        {/* Privacy Settings */}
        <FormControlLabel
          control={
            <Switch
              checked={isCloseFriends}
              onChange={(e) => setIsCloseFriends(e.target.checked)}
            />
          }
          label="Share with Close Friends only"
        />
      </Box>

      {/* Sticker Dialog */}
      <StickerDialog />

      {/* Music Dialog */}
      <Dialog open={showMusicDialog} onClose={() => setShowMusicDialog(false)} maxWidth="sm" fullWidth>
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add Music
          </Typography>
          <List>
            {musicTracks.map((track) => (
              <ListItem
                key={track.id}
                button
                onClick={() => {
                  setSelectedMusic(track);
                  setShowMusicDialog(false);
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <MusicNote />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={track.title}
                  secondary={`${track.artist} • ${track.usageCount.toLocaleString()} uses`}
                />
                {track.trending && <Chip label="Trending" size="small" color="primary" />}
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* Location Dialog */}
      <Dialog open={showLocationDialog} onClose={() => setShowLocationDialog(false)} maxWidth="sm" fullWidth>
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add Location
          </Typography>
          <List>
            {locations.map((location) => (
              <ListItem
                key={location.id}
                button
                onClick={() => addLocationSticker(location)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <LocationOn />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={location.name}
                  secondary={`${location.address} • ${location.postCount.toLocaleString()} posts`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* User Tag Dialog */}
      <Dialog open={showUserTagDialog} onClose={() => setShowUserTagDialog(false)} maxWidth="sm" fullWidth>
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Tag People
          </Typography>
          <List>
            {suggestedUsers.map((user) => (
              <ListItem
                key={user.id}
                button
                onClick={() => addUserMention(user)}
              >
                <ListItemAvatar>
                  <Avatar src={user.profilePicture} />
                </ListItemAvatar>
                <ListItemText
                  primary={user.displayName}
                  secondary={`@${user.username} • ${user.followersCount.toLocaleString()} followers`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EnhancedStoryCreator;