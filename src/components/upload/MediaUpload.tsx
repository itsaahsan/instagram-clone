import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Edit,
  VideoCall,
  PhotoCamera,
  Crop,
  Brightness6,
  Contrast,
  Palette,
  Close,
} from '@mui/icons-material';

export interface MediaFile {
  id: string;
  file: File;
  url: string;
  type: 'image' | 'video';
  duration?: number;
  thumbnail?: string;
}

export interface MediaFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  vignette: number;
  filterName: string;
}

interface MediaUploadProps {
  maxFiles?: number;
  acceptedTypes?: string[];
  maxFileSize?: number; // in MB
  onFilesChange: (files: MediaFile[]) => void;
  onFiltersChange?: (filters: MediaFilters) => void;
  showFilters?: boolean;
  allowVideo?: boolean;
  maxVideoDuration?: number; // in seconds
}

const FILTER_PRESETS = [
  { name: 'Normal', filterName: 'Normal', brightness: 0, contrast: 0, saturation: 0, vignette: 0 },
  { name: 'Vintage', filterName: 'Vintage', brightness: 10, contrast: 15, saturation: -20, vignette: 30 },
  { name: 'Bright', filterName: 'Bright', brightness: 20, contrast: 10, saturation: 15, vignette: 0 },
  { name: 'Drama', filterName: 'Drama', brightness: -10, contrast: 30, saturation: 20, vignette: 20 },
  { name: 'Cool', filterName: 'Cool', brightness: 5, contrast: 10, saturation: -10, vignette: 10 },
];

const MediaUpload: React.FC<MediaUploadProps> = ({
  maxFiles = 10,
  acceptedTypes = ['image/*', 'video/*'],
  maxFileSize = 100,
  onFilesChange,
  onFiltersChange,
  showFilters = false,
  allowVideo = true,
  maxVideoDuration = 60,
}) => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [editingFile, setEditingFile] = useState<MediaFile | null>(null);
  const [filters, setFilters] = useState<MediaFilters>(FILTER_PRESETS[0]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File): Promise<MediaFile | null> => {
    if (file.size > maxFileSize * 1024 * 1024) {
      alert(`File size must be less than ${maxFileSize}MB`);
      return null;
    }

    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('image/') ? 'image' : 'video';
    
    let duration: number | undefined;
    let thumbnail: string | undefined;

    if (type === 'video') {
      duration = await getVideoDuration(file);
      if (duration && duration > maxVideoDuration) {
        alert(`Video duration must be less than ${maxVideoDuration} seconds`);
        URL.revokeObjectURL(url);
        return null;
      }
      thumbnail = await generateVideoThumbnail(file);
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      file,
      url,
      type,
      duration,
      thumbnail,
    };
  }, [maxFileSize, maxVideoDuration]);

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        resolve(video.duration);
        URL.revokeObjectURL(video.src);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.currentTime = 1; // Get frame at 1 second
      };

      video.onseeked = () => {
        ctx.drawImage(video, 0, 0);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        resolve(thumbnail);
        URL.revokeObjectURL(video.src);
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (selectedFiles: FileList) => {
    if (files.length + selectedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);
    const newFiles: MediaFile[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      setUploadProgress((i / selectedFiles.length) * 100);
      
      const processedFile = await processFile(file);
      if (processedFile) {
        newFiles.push(processedFile);
      }
    }

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    setUploading(false);
    setUploadProgress(0);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles);
    }
  }, [files]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const handleFilterChange = (newFilters: MediaFilters) => {
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const applyFilterPreset = (preset: typeof FILTER_PRESETS[0]) => {
    const newFilters = { ...preset };
    handleFilterChange(newFilters);
  };

  const getFilterStyle = (file: MediaFile) => {
    if (!showFilters) return {};
    
    return {
      filter: `
        brightness(${100 + filters.brightness}%)
        contrast(${100 + filters.contrast}%)
        saturate(${100 + filters.saturation}%)
      `,
      position: 'relative',
      '&::after': filters.vignette > 0 ? {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle, transparent 30%, rgba(0,0,0,${filters.vignette / 100}) 100%)`,
        pointerEvents: 'none',
      } : {},
    };
  };

  return (
    <Box>
      {/* Upload Area */}
      <Paper
        elevation={isDragging ? 8 : 2}
        sx={{
          p: 4,
          textAlign: 'center',
          border: isDragging ? '2px dashed' : '2px solid transparent',
          borderColor: isDragging ? 'primary.main' : 'transparent',
          bgcolor: isDragging ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragging ? 'Drop files here' : 'Upload Photos and Videos'}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Drag and drop files here, or click to browse
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Maximum {maxFiles} files, up to {maxFileSize}MB each
          {allowVideo && `, videos up to ${maxVideoDuration}s`}
        </Typography>

        <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<PhotoCamera />}
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Add Photos
          </Button>
          {allowVideo && (
            <Button
              variant="outlined"
              startIcon={<VideoCall />}
              onClick={(e) => {
                e.stopPropagation();
                videoInputRef.current?.click();
              }}
            >
              Add Videos
            </Button>
          )}
        </Box>
      </Paper>

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="caption" color="text.secondary">
            Processing files... {Math.round(uploadProgress)}%
          </Typography>
        </Box>
      )}

      {/* File Preview Grid */}
      {files.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Selected Files ({files.length}/{maxFiles})
          </Typography>
          <Grid container spacing={2}>
            {files.map((file) => (
              <Grid item xs={6} sm={4} md={3} key={file.id}>
                <Paper
                  elevation={2}
                  sx={{
                    position: 'relative',
                    aspectRatio: '1',
                    overflow: 'hidden',
                    ...getFilterStyle(file),
                  }}
                >
                  {file.type === 'image' ? (
                    <img
                      src={file.url}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                      <img
                        src={file.thumbnail || file.url}
                        alt="Video thumbnail"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          bgcolor: 'rgba(0,0,0,0.6)',
                          borderRadius: '50%',
                          p: 1,
                        }}
                      >
                        <VideoCall sx={{ color: 'white', fontSize: 24 }} />
                      </Box>
                      {file.duration && (
                        <Typography
                          variant="caption"
                          sx={{
                            position: 'absolute',
                            bottom: 4,
                            right: 4,
                            bgcolor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            px: 1,
                            borderRadius: 1,
                          }}
                        >
                          {Math.round(file.duration)}s
                        </Typography>
                      )}
                    </Box>
                  )}
                  
                  {/* Action Buttons */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      display: 'flex',
                      gap: 0.5,
                    }}
                  >
                    {showFilters && (
                      <IconButton
                        size="small"
                        onClick={() => setEditingFile(file)}
                        sx={{
                          bgcolor: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => removeFile(file.id)}
                      sx={{
                        bgcolor: 'rgba(255,0,0,0.6)',
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,0,0,0.8)' },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Filter Editor Dialog */}
      <Dialog
        open={!!editingFile}
        onClose={() => setEditingFile(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Edit Photo
            <IconButton onClick={() => setEditingFile(null)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {editingFile && (
            <Box>
              {/* Preview */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 3,
                  bgcolor: 'grey.100',
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <img
                  src={editingFile.url}
                  alt="Edit preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    ...getFilterStyle(editingFile),
                  }}
                />
              </Box>

              {/* Filter Presets */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Filter Presets
                </Typography>
                <ToggleButtonGroup
                  value={filters.filterName}
                  exclusive
                  onChange={(_, value) => {
                    if (value) {
                      const preset = FILTER_PRESETS.find(p => p.name === value);
                      if (preset) applyFilterPreset(preset);
                    }
                  }}
                  size="small"
                >
                  {FILTER_PRESETS.map((preset) => (
                    <ToggleButton key={preset.name} value={preset.name}>
                      {preset.name}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>

              {/* Manual Adjustments */}
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography gutterBottom>
                    <Brightness6 sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Brightness
                  </Typography>
                  <Slider
                    value={filters.brightness}
                    onChange={(_, value) => 
                      handleFilterChange({ ...filters, brightness: value as number })
                    }
                    min={-50}
                    max={50}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>
                    <Contrast sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Contrast
                  </Typography>
                  <Slider
                    value={filters.contrast}
                    onChange={(_, value) => 
                      handleFilterChange({ ...filters, contrast: value as number })
                    }
                    min={-50}
                    max={50}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>
                    <Palette sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Saturation
                  </Typography>
                  <Slider
                    value={filters.saturation}
                    onChange={(_, value) => 
                      handleFilterChange({ ...filters, saturation: value as number })
                    }
                    min={-50}
                    max={50}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>
                    <Crop sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Vignette
                  </Typography>
                  <Slider
                    value={filters.vignette}
                    onChange={(_, value) => 
                      handleFilterChange({ ...filters, vignette: value as number })
                    }
                    min={0}
                    max={100}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingFile(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => setEditingFile(null)}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files) {
            handleFileSelect(e.target.files);
          }
        }}
      />
      <input
        ref={videoInputRef}
        type="file"
        multiple
        accept="video/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files) {
            handleFileSelect(e.target.files);
          }
        }}
      />
    </Box>
  );
};

export default MediaUpload;