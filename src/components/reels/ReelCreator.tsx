import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Slider,
  Card,
  CardContent,
  TextField,
  Chip,
  Avatar,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  MusicNote,
  FilterVintage,
  Timer,
  Speed,
  Crop,
  Palette,
  Close,
  Check,
  Mic,
  MicOff,
} from '@mui/icons-material';
import { MusicTrack, Effect, ReelTemplate } from '@/types';

interface ReelCreatorProps {
  onSave: (reelData: any) => void;
  onCancel: () => void;
}

const ReelCreator: React.FC<ReelCreatorProps> = ({ onSave, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [selectedMusic, setSelectedMusic] = useState<MusicTrack | null>(null);
  const [selectedEffects, setSelectedEffects] = useState<Effect[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ReelTemplate | null>(null);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [speed, setSpeed] = useState(1);
  const [timer, setTimer] = useState(0);
  const [isVoiceOver, setIsVoiceOver] = useState(false);
  const [showMusicDialog, setShowMusicDialog] = useState(false);
  const [showEffectsDialog, setShowEffectsDialog] = useState(false);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  // Mock data for music tracks
  const musicTracks: MusicTrack[] = [
    {
      id: '1',
      title: 'Trending Sound',
      artist: 'Popular Artist',
      url: '/audio/trending1.mp3',
      duration: 30,
      coverImage: '/images/music1.jpg',
      isOriginal: false,
      usageCount: 50000,
      category: 'trending',
      trending: true,
    },
    {
      id: '2',
      title: 'Original Audio',
      artist: 'You',
      url: '/audio/original.mp3',
      duration: 45,
      isOriginal: true,
      usageCount: 0,
      category: 'original',
    },
  ];

  // Mock data for effects
  const effects: Effect[] = [
    {
      id: '1',
      name: 'Beauty Filter',
      category: 'face',
      creator: 'Instagram',
      thumbnail: '/images/effect1.jpg',
      usageCount: 100000,
    },
    {
      id: '2',
      name: 'Vintage',
      category: 'world',
      creator: 'Retro Studios',
      thumbnail: '/images/effect2.jpg',
      usageCount: 75000,
    },
  ];

  // Mock data for templates
  const templates: ReelTemplate[] = [
    {
      id: '1',
      name: 'Quick Transition',
      description: 'Perfect for outfit changes',
      duration: 15,
      transitions: ['fade', 'slide'],
      musicSuggestions: musicTracks,
      thumbnail: '/images/template1.jpg',
      usageCount: 25000,
    },
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => prev + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
      } else {
        mediaRecorderRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const handleSave = () => {
    const reelData = {
      video: recordedChunks.current,
      caption,
      hashtags,
      music: selectedMusic,
      effects: selectedEffects,
      template: selectedTemplate,
      duration,
      speed,
      isVoiceOver,
    };
    onSave(reelData);
  };

  const addHashtag = (tag: string) => {
    if (tag && !hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <IconButton onClick={onCancel}>
          <Close />
        </IconButton>
        <Typography variant="h6">Create Reel</Typography>
        <Button onClick={handleSave} disabled={!recordedChunks.current.length}>
          <Check />
        </Button>
      </Box>

      {/* Camera View */}
      <Box sx={{ flex: 1, position: 'relative', bgcolor: 'black' }}>
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

        {/* Duration Timer */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            bgcolor: 'rgba(0,0,0,0.5)',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
          }}
        >
          {Math.floor(duration)}s / 90s
        </Box>

        {/* Speed Control */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <IconButton
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            onClick={() => setSpeed(speed === 0.5 ? 1 : speed === 1 ? 2 : 0.5)}
          >
            <Speed />
          </IconButton>
          <Typography variant="caption" sx={{ color: 'white', textAlign: 'center' }}>
            {speed}x
          </Typography>
        </Box>

        {/* Side Controls */}
        <Box
          sx={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <IconButton
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            onClick={() => setShowEffectsDialog(true)}
          >
            <FilterVintage />
          </IconButton>

          <IconButton
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            onClick={() => setShowMusicDialog(true)}
          >
            <MusicNote />
          </IconButton>

          <IconButton
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            onClick={() => setShowTemplatesDialog(true)}
          >
            <Timer />
          </IconButton>

          <IconButton
            sx={{
              bgcolor: isVoiceOver ? 'rgba(255,0,0,0.5)' : 'rgba(255,255,255,0.2)',
              color: 'white',
            }}
            onClick={() => setIsVoiceOver(!isVoiceOver)}
          >
            {isVoiceOver ? <Mic /> : <MicOff />}
          </IconButton>
        </Box>
      </Box>

      {/* Bottom Controls */}
      <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton
            onClick={pauseRecording}
            disabled={!isRecording}
            sx={{ bgcolor: isPaused ? 'warning.main' : 'primary.main', color: 'white' }}
          >
            {isPaused ? <PlayArrow /> : <Pause />}
          </IconButton>

          <IconButton
            onClick={isRecording ? stopRecording : startRecording}
            sx={{
              bgcolor: isRecording ? 'error.main' : 'primary.main',
              color: 'white',
              width: 64,
              height: 64,
            }}
          >
            {isRecording ? <Stop /> : <PlayArrow />}
          </IconButton>
        </Box>

        {/* Caption Input */}
        <TextField
          fullWidth
          multiline
          rows={2}
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          sx={{ mb: 1 }}
        />

        {/* Hashtags */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          {hashtags.map((tag) => (
            <Chip
              key={tag}
              label={`#${tag}`}
              onDelete={() => setHashtags(hashtags.filter(t => t !== tag))}
              size="small"
            />
          ))}
        </Box>

        <TextField
          fullWidth
          placeholder="Add hashtags..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const input = e.target as HTMLInputElement;
              addHashtag(input.value.replace('#', ''));
              input.value = '';
            }
          }}
          size="small"
        />
      </Box>

      {/* Music Selection Dialog */}
      <Dialog open={showMusicDialog} onClose={() => setShowMusicDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Choose Music</DialogTitle>
        <DialogContent>
          <List>
            {musicTracks.map((track) => (
              <ListItem
                key={track.id}
                button
                onClick={() => {
                  setSelectedMusic(track);
                  setShowMusicDialog(false);
                }}
                selected={selectedMusic?.id === track.id}
              >
                <ListItemAvatar>
                  <Avatar src={track.coverImage}>
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

      {/* Effects Dialog */}
      <Dialog open={showEffectsDialog} onClose={() => setShowEffectsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Choose Effects</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {effects.map((effect) => (
              <Grid item xs={6} sm={4} key={effect.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: selectedEffects.find(e => e.id === effect.id) ? 2 : 0,
                    borderColor: 'primary.main',
                  }}
                  onClick={() => {
                    const isSelected = selectedEffects.find(e => e.id === effect.id);
                    if (isSelected) {
                      setSelectedEffects(selectedEffects.filter(e => e.id !== effect.id));
                    } else {
                      setSelectedEffects([...selectedEffects, effect]);
                    }
                  }}
                >
                  <Box
                    sx={{
                      height: 120,
                      backgroundImage: `url(${effect.thumbnail})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="caption" display="block">
                      {effect.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      by {effect.creator}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Templates Dialog */}
      <Dialog open={showTemplatesDialog} onClose={() => setShowTemplatesDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Choose Template</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {templates.map((template) => (
              <Grid item xs={12} sm={6} key={template.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: selectedTemplate?.id === template.id ? 2 : 0,
                    borderColor: 'primary.main',
                  }}
                  onClick={() => {
                    setSelectedTemplate(template);
                    setShowTemplatesDialog(false);
                  }}
                >
                  <Box
                    sx={{
                      height: 150,
                      backgroundImage: `url(${template.thumbnail})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6">{template.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {template.description}
                    </Typography>
                    <Typography variant="caption">
                      {template.usageCount.toLocaleString()} uses • {template.duration}s
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ReelCreator;