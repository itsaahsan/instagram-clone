import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Dialog,
  DialogContent,
  Fab,
  Slider,
  Button,
  TextField,
  Avatar,
  Grid,
  Card,
  CardContent,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  
  Popover,
} from '@mui/material';
import {
  Close,
  PhotoCamera,
  VideoCall,
  TextFields,
  Palette,
  EmojiEmotions,
  Poll,
  QuestionAnswer,
  MusicNote,
  LocationOn,
  Tag,
  Send,
  Save,
  Undo,
  Redo,
  FormatSize,
  FormatColorText,
  Brightness6,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { StorySticker, Story } from '@/types';

interface StoryCreatorProps {
  open: boolean;
  onClose: () => void;
  onStoryCreated: (story: Partial<Story>) => void;
}

interface TextSticker {
  id: string;
  text: string;
  position: { x: number; y: number };
  fontSize: number;
  color: string;
  backgroundColor?: string;
  rotation: number;
}

interface StickerData {
  type: 'poll' | 'question' | 'music' | 'location' | 'hashtag' | 'emoji' | 'text';
  position: { x: number; y: number };
  data: any;
}

const BACKGROUND_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

const TEXT_COLORS = [
  '#FFFFFF', '#000000', '#FF6B6B', '#4ECDC4', '#45B7D1',
  '#96CEB4', '#FFEAA7', '#DDA0DD', '#F39C12', '#E74C3C'
];

const StoryCreator: React.FC<StoryCreatorProps> = ({
  open,
  onClose,
  onStoryCreated,
}) => {
  const { user } = useAuth();
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'text'>('text');
  const [backgroundColor, setBackgroundColor] = useState(BACKGROUND_COLORS[0]);
  const [textStickers, setTextStickers] = useState<TextSticker[]>([]);
  const [stickers, setStickers] = useState<StickerData[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'media' | 'text' | 'stickers'>('media');
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [currentTextColor, setCurrentTextColor] = useState(TEXT_COLORS[0]);
  const [currentTextSize, setCurrentTextSize] = useState(24);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      alert('File size must be less than 50MB');
      return;
    }

    const url = URL.createObjectURL(file);
    setMediaFile(file);
    setMediaUrl(url);
    setMediaType(file.type.startsWith('image/') ? 'image' : 'video');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const addTextSticker = () => {
    if (!currentText.trim()) return;

    const newSticker: TextSticker = {
      id: Math.random().toString(36).substr(2, 9),
      text: currentText,
      position: { x: 50, y: 50 }, // Center position (percentage)
      fontSize: currentTextSize,
      color: currentTextColor,
      rotation: 0,
    };

    setTextStickers(prev => [...prev, newSticker]);
    setCurrentText('');
    setShowTextEditor(false);
  };

  const addSticker = (type: StickerData['type'], data: any) => {
    const newSticker: StickerData = {
      type,
      position: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 },
      data,
    };
    setStickers(prev => [...prev, newSticker]);
  };

  const addPollSticker = () => {
    const pollData = {
      question: 'Your question here',
      options: ['Yes', 'No'],
      votes: [0, 0],
    };
    addSticker('poll', pollData);
  };

  const addQuestionSticker = () => {
    const questionData = {
      placeholder: 'Ask me a question',
      responses: [],
    };
    addSticker('question', questionData);
  };

  const addLocationSticker = () => {
    const locationData = {
      name: 'Add location',
      coordinates: null,
    };
    addSticker('location', locationData);
  };

  const renderStoryPreview = () => {
    const containerStyle: React.CSSProperties = {
      width: '100%',
      height: '600px',
      position: 'relative',
      borderRadius: '12px',
      overflow: 'hidden',
      background: mediaType === 'text' ? backgroundColor : 'transparent',
    };

    return (
      <Box sx={containerStyle}>
        {/* Media Background */}
        {mediaType === 'image' && mediaUrl && (
          <img
            src={mediaUrl}
            alt="Story background"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
        
        {mediaType === 'video' && mediaUrl && (
          <video
            src={mediaUrl}
            controls={false}
            muted
            loop
            autoPlay
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        {/* Text Stickers */}
        {textStickers.map((sticker) => (
          <Box
            key={sticker.id}
            sx={{
              position: 'absolute',
              left: `${sticker.position.x}%`,
              top: `${sticker.position.y}%`,
              transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
              cursor: 'move',
              userSelect: 'none',
              fontSize: `${sticker.fontSize}px`,
              color: sticker.color,
              backgroundColor: sticker.backgroundColor,
              padding: sticker.backgroundColor ? '4px 8px' : 0,
              borderRadius: sticker.backgroundColor ? '4px' : 0,
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              maxWidth: '80%',
              wordBreak: 'break-word',
              textAlign: 'center',
              border: selectedSticker === sticker.id ? '2px dashed white' : 'none',
            }}
            onClick={() => setSelectedSticker(sticker.id)}
          >
            {sticker.text}
          </Box>
        ))}

        {/* Interactive Stickers */}
        {stickers.map((sticker, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              left: `${sticker.position.x}%`,
              top: `${sticker.position.y}%`,
              transform: 'translate(-50%, -50%)',
              cursor: 'move',
            }}
          >
            {sticker.type === 'poll' && (
              <Card sx={{ minWidth: 200, bgcolor: 'rgba(0,0,0,0.7)', color: 'white' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    {sticker.data.question}
                  </Typography>
                  {sticker.data.options.map((option: string, idx: number) => (
                    <Button
                      key={idx}
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ mt: 1, color: 'white', borderColor: 'white' }}
                    >
                      {option}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}

            {sticker.type === 'question' && (
              <Card sx={{ minWidth: 200, bgcolor: 'rgba(0,0,0,0.7)', color: 'white' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <QuestionAnswer sx={{ fontSize: 20 }} />
                    <Typography variant="body2">
                      {sticker.data.placeholder}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}

            {sticker.type === 'location' && (
              <Chip
                icon={<LocationOn />}
                label={sticker.data.name}
                sx={{
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  '& .MuiChip-icon': { color: 'white' },
                }}
              />
            )}
          </Box>
        ))}

        {/* Upload Overlay for empty state */}
        {!mediaUrl && mediaType !== 'text' && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.8)',
              color: 'white',
              cursor: 'pointer',
            }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            <PhotoCamera sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Add Photo or Video
            </Typography>
            <Typography variant="body2">
              Drag and drop or click to browse
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const handlePublish = () => {
    const storyData: Partial<Story> = {
      userId: user?.id,
      user: user!,
      mediaUrl: mediaUrl || backgroundColor,
      mediaType: mediaType === 'text' ? 'image' : mediaType,
      backgroundColor: mediaType === 'text' ? backgroundColor : undefined,
      stickers: stickers.map(s => ({
        id: Math.random().toString(36).substr(2, 9),
        type: s.type,
        position: s.position,
        data: s.data,
      })),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      viewsCount: 0,
      isViewed: false,
    };

    onStoryCreated(storyData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { height: '90vh', maxHeight: '800px' }
      }}
    >
      <DialogContent sx={{ p: 0, display: 'flex', height: '100%' }}>
        {/* Left Panel - Tools */}
        <Box sx={{ width: 300, borderRight: 1, borderColor: 'divider', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Create Story</Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>

          {/* Tab Navigation */}
          <ToggleButtonGroup
            value={activeTab}
            exclusive
            onChange={(_, value) => value && setActiveTab(value)}
            fullWidth
            sx={{ mb: 3 }}
          >
            <ToggleButton value="media" size="small">
              <PhotoCamera sx={{ mr: 1 }} />
              Media
            </ToggleButton>
            <ToggleButton value="text" size="small">
              <TextFields sx={{ mr: 1 }} />
              Text
            </ToggleButton>
            <ToggleButton value="stickers" size="small">
              <EmojiEmotions sx={{ mr: 1 }} />
              Stickers
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Media Tab */}
          {activeTab === 'media' && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<PhotoCamera />}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Photo
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<VideoCall />}
                    onClick={() => videoInputRef.current?.click()}
                  >
                    Video
                  </Button>
                </Grid>
              </Grid>

              {mediaType === 'text' && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Background Color
                  </Typography>
                  <Grid container spacing={1}>
                    {BACKGROUND_COLORS.map((color) => (
                      <Grid item xs={2.4} key={color}>
                        <Box
                          sx={{
                            width: '100%',
                            height: 40,
                            bgcolor: color,
                            borderRadius: 1,
                            cursor: 'pointer',
                            border: backgroundColor === color ? '3px solid white' : '1px solid #ddd',
                          }}
                          onClick={() => setBackgroundColor(color)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>
          )}

          {/* Text Tab */}
          {activeTab === 'text' && (
            <Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add text..."
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Typography variant="subtitle2" gutterBottom>
                Text Size
              </Typography>
              <Slider
                value={currentTextSize}
                onChange={(_, value) => setCurrentTextSize(value as number)}
                min={12}
                max={72}
                marks
                valueLabelDisplay="auto"
                sx={{ mb: 2 }}
              />

              <Typography variant="subtitle2" gutterBottom>
                Text Color
              </Typography>
              <Grid container spacing={1} sx={{ mb: 2 }}>
                {TEXT_COLORS.map((color) => (
                  <Grid item xs={2.4} key={color}>
                    <Box
                      sx={{
                        width: '100%',
                        height: 30,
                        bgcolor: color,
                        borderRadius: 1,
                        cursor: 'pointer',
                        border: currentTextColor === color ? '3px solid blue' : '1px solid #ddd',
                      }}
                      onClick={() => setCurrentTextColor(color)}
                    />
                  </Grid>
                ))}
              </Grid>

              <Button
                variant="contained"
                fullWidth
                onClick={addTextSticker}
                disabled={!currentText.trim()}
              >
                Add Text
              </Button>
            </Box>
          )}

          {/* Stickers Tab */}
          {activeTab === 'stickers' && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Poll />}
                    onClick={addPollSticker}
                  >
                    Poll
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<QuestionAnswer />}
                    onClick={addQuestionSticker}
                  >
                    Question
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<MusicNote />}
                    disabled
                  >
                    Music
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<LocationOn />}
                    onClick={addLocationSticker}
                  >
                    Location
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ mt: 'auto', pt: 3 }}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handlePublish}
              disabled={!mediaUrl && textStickers.length === 0 && mediaType !== 'text'}
            >
              Share to Story
            </Button>
          </Box>
        </Box>

        {/* Right Panel - Preview */}
        <Box sx={{ flex: 1, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ width: '300px', height: '600px' }}>
            {renderStoryPreview()}
          </Box>
        </Box>

        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFileSelect(e.target.files[0]);
            }
          }}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFileSelect(e.target.files[0]);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default StoryCreator;