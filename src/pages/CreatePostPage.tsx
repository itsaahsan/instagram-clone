import React, { useState, useRef } from 'react';
import MediaUpload, { MediaFile, MediaFilters } from '@/components/upload/MediaUpload';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Avatar,
  Alert,
  Paper,
  IconButton,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Stack,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Autocomplete,
  Grid,
  CardMedia,
  Stepper,
  Step,
  StepLabel,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import {
  PhotoCamera,
  Collections,
  Videocam,
  LocationOn,
  Tag,
  Settings,
  Close,
  ArrowBack,
  Add,
  Delete,
  Tune,
  MusicNote,
  PersonAdd,
  NavigateNext,
  NavigateBefore,
  Brightness6,
  Contrast,
  Colorize,
  Vignette,
  FilterVintage,
  Palette,
  BlurOn,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { mockUsers } from '@/data/mockData';
import { PostFilter, MusicTrack, User } from '@/types';

// Mock data for features
const mockLocations = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
  'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA'
];

const mockMusicTracks: MusicTrack[] = [
  {
    id: '1',
    title: 'Summer Vibes',
    artist: 'DJ Cool',
    url: 'audio1.mp3',
    duration: 30,
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop'
  },
  {
    id: '2',
    title: 'Chill Beats',
    artist: 'Lo-Fi Master',
    url: 'audio2.mp3',
    duration: 45,
    coverImage: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=100&h=100&fit=crop'
  }
];

const filterPresets: PostFilter[] = [
  { name: 'Normal', brightness: 0, contrast: 0, saturation: 0, vignette: 0 },
  { name: 'Clarendon', brightness: 10, contrast: 15, saturation: 20, vignette: 0 },
  { name: 'Gingham', brightness: 5, contrast: -10, saturation: -20, vignette: 20 },
  { name: 'Moon', brightness: -15, contrast: 20, saturation: -30, vignette: 40 },
  { name: 'Lark', brightness: 15, contrast: -10, saturation: 25, vignette: 0 },
  { name: 'Reyes', brightness: 5, contrast: -15, saturation: -25, vignette: 30 },
];

const CreatePostPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const postType = searchParams.get('type') || 'post';
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  // Basic states
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Enhanced features
  const [step, setStep] = useState(0); // 0: Select, 1: Edit, 2: Share
  const [taggedUsers, setTaggedUsers] = useState<User[]>([]);
  const [collabUsers, setCollabUsers] = useState<User[]>([]);
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [likesVisible, setLikesVisible] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<PostFilter>(filterPresets[0]);
  const [customFilters, setCustomFilters] = useState<PostFilter>({
    name: 'Custom',
    brightness: 0,
    contrast: 0,
    saturation: 0,
    vignette: 0,
  });
  const [selectedMusic, setSelectedMusic] = useState<MusicTrack | null>(null);
  
  // Dialog states
  const [showFilters, setShowFilters] = useState(false);
  const [showMusicDialog, setShowMusicDialog] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [showCollabDialog, setShowCollabDialog] = useState(false);
  
  const maxFiles = postType === 'reel' ? 1 : 10;
  const maxDuration = postType === 'reel' ? 90 : 60; // seconds

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;
    
    // Check file limits
    if (selectedFiles.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }
    
    const validFiles: File[] = [];
    const newPreviews: string[] = [];
    
    files.forEach(file => {
      // Size limit check
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast.error(`${file.name} is too large. Maximum 100MB allowed.`);
        return;
      }
      
      // Type check
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (postType === 'reel' && !isVideo) {
        toast.error('Reels only support video files');
        return;
      }
      
      if (!isImage && !isVideo) {
        toast.error('Only image and video files are supported');
        return;
      }
      
      validFiles.push(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        if (newPreviews.length === validFiles.length) {
          setSelectedFiles(prev => [...prev, ...validFiles]);
          setPreviews(prev => [...prev, ...newPreviews]);
          if (step === 0 && validFiles.length > 0) {
            setStep(1); // Move to edit step
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
    if (currentSlide >= index && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const addHashtag = (tag: string) => {
    if (!caption.includes(`#${tag}`)) {
      setCaption(prev => prev + ` #${tag}`);
    }
  };

  const addMention = (username: string) => {
    if (!caption.includes(`@${username}`)) {
      setCaption(prev => prev + ` @${username}`);
    }
  };

  const handlePost = async () => {
    if (selectedFiles.length === 0) {
      toast.error(`Please select ${postType === 'reel' ? 'a video' : 'media files'}`);
      return;
    }

    if (!caption.trim()) {
      toast.error('Please add a caption');
      return;
    }

    setIsUploading(true);
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would upload the image and create the post
      toast.success('Post created successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setIsUploading(false);
    }
  };

  const extractHashtags = (text: string) => {
    const hashtags = text.match(/#\w+/g);
    return hashtags ? hashtags.length : 0;
  };

  const renderStepContent = () => {
    switch (step) {
      case 0: // Select Files
        return (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h5" gutterBottom>
              {postType === 'reel' ? 'Create New Reel' : 'Create New Post'}
            </Typography>
            
            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'grey.300',
                borderRadius: 2,
                p: 6,
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'grey.50',
                },
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {postType === 'reel' ? (
                <Videocam sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              ) : (
                <Collections sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              )}
              <Typography variant="h6" gutterBottom>
                {postType === 'reel' ? 'Select Video' : 'Select Photos and Videos'}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {postType === 'reel' 
                  ? `Up to ${maxDuration} seconds` 
                  : `Up to ${maxFiles} files`}
              </Typography>
              <Button variant="contained" startIcon={<Collections />}>
                Choose from Computer
              </Button>
            </Box>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept={postType === 'reel' ? 'video/*' : 'image/*,video/*'}
              multiple={postType !== 'reel'}
              style={{ display: 'none' }}
            />
          </Box>
        );

      case 1: // Edit
        return (
          <Box>
            {/* Media Preview */}
            <Box sx={{ position: 'relative', mb: 3 }}>
              {previews.length > 0 && (
                <Box sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      position: 'relative',
                      borderRadius: 2,
                      overflow: 'hidden',
                      aspectRatio: postType === 'reel' ? '9/16' : '1/1',
                      maxHeight: postType === 'reel' ? 600 : 400,
                    }}
                  >
                    {selectedFiles[currentSlide]?.type.startsWith('video/') ? (
                      <video
                        src={previews[currentSlide]}
                        controls
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: `brightness(${100 + selectedFilter.brightness}%) 
                                   contrast(${100 + selectedFilter.contrast}%) 
                                   saturate(${100 + selectedFilter.saturation}%)`,
                        }}
                      />
                    ) : (
                      <img
                        src={previews[currentSlide]}
                        alt="Preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: `brightness(${100 + selectedFilter.brightness}%) 
                                   contrast(${100 + selectedFilter.contrast}%) 
                                   saturate(${100 + selectedFilter.saturation}%)`,
                        }}
                      />
                    )}
                  </Box>
                  
                  {/* Carousel Controls */}
                  {previews.length > 1 && (
                    <>
                      <IconButton
                        sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}
                        onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                        disabled={currentSlide === 0}
                      >
                        <NavigateBefore />
                      </IconButton>
                      <IconButton
                        sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}
                        onClick={() => setCurrentSlide(Math.min(previews.length - 1, currentSlide + 1))}
                        disabled={currentSlide === previews.length - 1}
                      >
                        <NavigateNext />
                      </IconButton>
                    </>
                  )}
                </Box>
              )}
            </Box>

            {/* Edit Tools */}
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <Button
                startIcon={<Tune />}
                onClick={() => setShowFilters(true)}
                variant={selectedFilter.name !== 'Normal' ? 'contained' : 'outlined'}
              >
                Filters
              </Button>
              {postType === 'reel' && (
                <Button
                  startIcon={<MusicNote />}
                  onClick={() => setShowMusicDialog(true)}
                  variant={selectedMusic ? 'contained' : 'outlined'}
                >
                  Music
                </Button>
              )}
              <Button
                startIcon={<Add />}
                onClick={() => fileInputRef.current?.click()}
                disabled={selectedFiles.length >= maxFiles}
              >
                Add More
              </Button>
            </Stack>
          </Box>
        );

      case 2: // Share
        return (
          <Box>
            {/* Final Preview */}
            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                {previews[0] && (
                  <Box
                    sx={{
                      borderRadius: 2,
                      overflow: 'hidden',
                      aspectRatio: postType === 'reel' ? '9/16' : '1/1',
                      maxHeight: 300,
                    }}
                  >
                    {selectedFiles[0]?.type.startsWith('video/') ? (
                      <video
                        src={previews[0]}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <img
                        src={previews[0]}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </Box>
                )}
              </Box>
              
              <Box sx={{ flex: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={user?.profilePicture} sx={{ mr: 2 }} />
                  <Typography variant="subtitle1">{user?.username}</Typography>
                </Box>
                
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  sx={{ mb: 2 }}
                />

                {/* Enhanced Options */}
                <Stack spacing={2}>
                  <Button
                    startIcon={<LocationOn />}
                    onClick={() => setShowLocationDialog(true)}
                    variant="text"
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    {location || 'Add location'}
                  </Button>
                  
                  <Button
                    startIcon={<Tag />}
                    onClick={() => setShowTagDialog(true)}
                    variant="text"
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Tag people ({taggedUsers.length})
                  </Button>

                  <Button
                    startIcon={<PersonAdd />}
                    onClick={() => setShowCollabDialog(true)}
                    variant="text"
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Invite collaborator ({collabUsers.length})
                  </Button>

                  <Divider />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={commentsEnabled}
                        onChange={(e) => setCommentsEnabled(e.target.checked)}
                      />
                    }
                    label="Turn on commenting"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={!likesVisible}
                        onChange={(e) => setLikesVisible(!e.target.checked)}
                      />
                    }
                    label="Hide like and view counts"
                  />
                </Stack>
              </Box>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2 }}>
        <IconButton onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
          {postType === 'reel' ? 'Create Reel' : 'Create Post'}
        </Typography>
        {step === 2 && (
          <Button
            variant="contained"
            onClick={handlePost}
            disabled={isUploading || selectedFiles.length === 0}
          >
            {isUploading ? 'Sharing...' : 'Share'}
          </Button>
        )}
      </Box>

      {/* Progress Stepper */}
      {step > 0 && (
        <Stepper activeStep={step - 1} sx={{ mb: 3 }}>
          <Step>
            <StepLabel>Edit</StepLabel>
          </Step>
          <Step>
            <StepLabel>Share</StepLabel>
          </Step>
        </Stepper>
      )}

      {/* Content */}
      <Paper sx={{ p: 3 }}>
        {renderStepContent()}
        
        {step === 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button onClick={() => setStep(0)}>Back</Button>
            <Button variant="contained" onClick={() => setStep(2)}>
              Next
            </Button>
          </Box>
        )}
      </Paper>

      {/* Loading Progress */}
      {isUploading && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}>
          <LinearProgress />
        </Box>
      )}

      {/* Filters Dialog */}
      <Dialog open={showFilters} onClose={() => setShowFilters(false)} maxWidth="md" fullWidth>
        <DialogTitle>Filters</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {filterPresets.map((filter) => (
              <Grid item xs={4} sm={3} key={filter.name}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: selectedFilter.name === filter.name ? '2px solid #1976d2' : 'none',
                  }}
                  onClick={() => setSelectedFilter(filter)}
                >
                  <Box sx={{ p: 1, textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: '100%',
                        aspectRatio: '1',
                        bgcolor: 'grey.200',
                        borderRadius: 1,
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FilterVintage />
                    </Box>
                    <Typography variant="caption">{filter.name}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Custom Adjustments
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Brightness</Typography>
            <Slider
              value={customFilters.brightness}
              onChange={(_, value) => setCustomFilters(prev => ({ ...prev, brightness: value as number }))}
              min={-50}
              max={50}
              valueLabelDisplay="auto"
            />
            
            <Typography gutterBottom sx={{ mt: 2 }}>Contrast</Typography>
            <Slider
              value={customFilters.contrast}
              onChange={(_, value) => setCustomFilters(prev => ({ ...prev, contrast: value as number }))}
              min={-50}
              max={50}
              valueLabelDisplay="auto"
            />
            
            <Typography gutterBottom sx={{ mt: 2 }}>Saturation</Typography>
            <Slider
              value={customFilters.saturation}
              onChange={(_, value) => setCustomFilters(prev => ({ ...prev, saturation: value as number }))}
              min={-50}
              max={50}
              valueLabelDisplay="auto"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFilters(false)}>Cancel</Button>
          <Button onClick={() => {
            setSelectedFilter(customFilters);
            setShowFilters(false);
          }} variant="contained">
            Apply Custom
          </Button>
        </DialogActions>
      </Dialog>

      {/* Music Dialog */}
      <Dialog open={showMusicDialog} onClose={() => setShowMusicDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Music</DialogTitle>
        <DialogContent>
          <List>
            {mockMusicTracks.map((track) => (
              <ListItem
                key={track.id}
                button
                onClick={() => {
                  setSelectedMusic(track);
                  setShowMusicDialog(false);
                }}
              >
                <ListItemAvatar>
                  <Avatar src={track.coverImage} />
                </ListItemAvatar>
                <ListItemText
                  primary={track.title}
                  secondary={`${track.artist} • ${track.duration}s`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMusicDialog(false)}>Cancel</Button>
          <Button onClick={() => {
            setSelectedMusic(null);
            setShowMusicDialog(false);
          }}>
            Remove Music
          </Button>
        </DialogActions>
      </Dialog>

      {/* Location Dialog */}
      <Dialog open={showLocationDialog} onClose={() => setShowLocationDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Location</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={mockLocations}
            value={location}
            onChange={(_, newValue) => setLocation(newValue || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search for a location"
                fullWidth
                autoFocus
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLocationDialog(false)}>Cancel</Button>
          <Button onClick={() => setShowLocationDialog(false)} variant="contained">
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tag People Dialog */}
      <Dialog open={showTagDialog} onClose={() => setShowTagDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tag People</DialogTitle>
        <DialogContent>
          <TextField
            placeholder="Search people..."
            fullWidth
            sx={{ mb: 2 }}
          />
          <List>
            {mockUsers.slice(1, 6).map((user) => (
              <ListItem
                key={user.id}
                button
                onClick={() => {
                  if (!taggedUsers.find(u => u.id === user.id)) {
                    setTaggedUsers(prev => [...prev, user]);
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar src={user.profilePicture} />
                </ListItemAvatar>
                <ListItemText
                  primary={user.displayName}
                  secondary={`@${user.username}`}
                />
              </ListItem>
            ))}
          </List>
          
          {taggedUsers.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Tagged Users:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {taggedUsers.map((user) => (
                  <Chip
                    key={user.id}
                    label={`@${user.username}`}
                    onDelete={() => setTaggedUsers(prev => prev.filter(u => u.id !== user.id))}
                    size="small"
                  />
                ))}
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTagDialog(false)}>Done</Button>
        </DialogActions>
      </Dialog>

      {/* Collaboration Dialog */}
      <Dialog open={showCollabDialog} onClose={() => setShowCollabDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Invite Collaborator</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Collaborators will be able to share this post to their profile too.
          </Alert>
          <TextField
            placeholder="Search for collaborators..."
            fullWidth
            sx={{ mb: 2 }}
          />
          <List>
            {mockUsers.slice(1, 4).map((user) => (
              <ListItem
                key={user.id}
                button
                onClick={() => {
                  if (!collabUsers.find(u => u.id === user.id)) {
                    setCollabUsers(prev => [...prev, user]);
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar src={user.profilePicture} />
                </ListItemAvatar>
                <ListItemText
                  primary={user.displayName}
                  secondary={`@${user.username}`}
                />
              </ListItem>
            ))}
          </List>

          {collabUsers.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Collaborators:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {collabUsers.map((user) => (
                  <Chip
                    key={user.id}
                    label={`@${user.username}`}
                    onDelete={() => setCollabUsers(prev => prev.filter(u => u.id !== user.id))}
                    size="small"
                  />
                ))}
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCollabDialog(false)}>Done</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreatePostPage;