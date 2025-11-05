import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Avatar,
  Fade,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Share,
  MoreVert,
  MusicNote,
} from '@mui/icons-material';
import { Post } from '@/types';

interface ReelPlayerProps {
  reel: Post & { viewsCount?: number };
  isActive: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  autoPlay?: boolean;
  showControls?: boolean;
}

const ReelPlayer: React.FC<ReelPlayerProps> = ({
  reel,
  isActive,
  onLike,
  onComment,
  onShare,
  autoPlay = true,
  showControls = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showControlsLocal, setShowControlsLocal] = useState(true);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoading(false);
      setDuration(video.duration);
      if (isActive && autoPlay) {
        video.play().then(() => {
          setIsPlaying(true);
        }).catch(console.error);
      }
    };

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      video.currentTime = 0;
      // Auto-replay for reels
      if (isActive) {
        video.play();
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [isActive, autoPlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive && autoPlay && !isLoading) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  }, [isActive, autoPlay, isLoading]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(console.error);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVideoClick = () => {
    togglePlayPause();
    showControlsTemporarily();
  };

  const showControlsTemporarily = () => {
    setShowControlsLocal(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControlsLocal(false);
    }, 3000);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        bgcolor: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
      onMouseMove={showControlsTemporarily}
      onTouchStart={showControlsTemporarily}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        poster={reel.imageUrl}
        loop
        playsInline
        muted={isMuted}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          cursor: 'pointer',
        }}
        onClick={handleVideoClick}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.7)',
          }}
        >
          <CircularProgress sx={{ color: 'white' }} />
        </Box>
      )}

      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          bgcolor: 'rgba(255,255,255,0.3)',
          '& .MuiLinearProgress-bar': {
            bgcolor: 'white',
          },
        }}
      />

      {/* Play/Pause Overlay */}
      <Fade in={!isPlaying && !isLoading}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'rgba(0,0,0,0.6)',
            borderRadius: '50%',
            p: 2,
          }}
        >
          <PlayArrow sx={{ color: 'white', fontSize: 48 }} />
        </Box>
      </Fade>

      {/* User Info Overlay */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 80,
          left: 16,
          right: 80,
          color: 'white',
        }}
      >
        {/* User */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={reel.user.profilePicture}
            alt={reel.user.displayName}
            sx={{ width: 40, height: 40, mr: 2 }}
          >
            {reel.user.displayName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {reel.user.displayName}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              @{reel.user.username}
            </Typography>
          </Box>
        </Box>

        {/* Caption */}
        {reel.caption && (
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {reel.caption}
          </Typography>
        )}

        {/* Music Info */}
        {reel.musicTrack && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <MusicNote sx={{ fontSize: 16, mr: 1, opacity: 0.8 }} />
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {reel.musicTrack.title} - {reel.musicTrack.artist}
            </Typography>
          </Box>
        )}

        {/* Tags */}
        {reel.tags.length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {reel.tags.slice(0, 3).map((tag) => (
              <Typography
                key={tag}
                variant="caption"
                sx={{
                  color: '#1976d2',
                  fontWeight: 500,
                }}
              >
                #{tag}
              </Typography>
            ))}
          </Box>
        )}
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          position: 'absolute',
          right: 16,
          bottom: 80,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          alignItems: 'center',
        }}
      >
        {/* Like */}
        <Box sx={{ textAlign: 'center' }}>
          <IconButton
            onClick={onLike}
            sx={{
              color: reel.isLiked ? '#ff3040' : 'white',
              bgcolor: 'rgba(0,0,0,0.3)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
            }}
          >
            {reel.isLiked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <Typography variant="caption" sx={{ color: 'white', display: 'block', mt: 0.5 }}>
            {formatCount(reel.likesCount)}
          </Typography>
        </Box>

        {/* Comment */}
        <Box sx={{ textAlign: 'center' }}>
          <IconButton
            onClick={onComment}
            sx={{
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.3)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
            }}
          >
            <ChatBubbleOutline />
          </IconButton>
          <Typography variant="caption" sx={{ color: 'white', display: 'block', mt: 0.5 }}>
            {formatCount(reel.commentsCount)}
          </Typography>
        </Box>

        {/* Share */}
        <Box sx={{ textAlign: 'center' }}>
          <IconButton
            onClick={onShare}
            sx={{
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.3)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
            }}
          >
            <Share />
          </IconButton>
          <Typography variant="caption" sx={{ color: 'white', display: 'block', mt: 0.5 }}>
            Share
          </Typography>
        </Box>

        {/* More */}
        <IconButton
          sx={{
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.3)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
          }}
        >
          <MoreVert />
        </IconButton>
      </Box>

      {/* Controls */}
      {showControlsLocal && (
        <Fade in={showControlsLocal}>
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: 'flex',
              gap: 1,
            }}
          >
            <IconButton
              onClick={toggleMute}
              sx={{
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.3)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
              }}
            >
              {isMuted ? <VolumeOff /> : <VolumeUp />}
            </IconButton>
          </Box>
        </Fade>
      )}

      {/* Views Count */}
      {reel.viewsCount && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            bgcolor: 'rgba(0,0,0,0.6)',
            color: 'white',
            px: 2,
            py: 0.5,
            borderRadius: 2,
          }}
        >
          <Typography variant="caption">
            {formatCount(reel.viewsCount)} views
          </Typography>
        </Box>
      )}

      {/* Duration */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          bgcolor: 'rgba(0,0,0,0.6)',
          color: 'white',
          px: 1,
          py: 0.5,
          borderRadius: 1,
        }}
      >
        <Typography variant="caption">
          {formatTime(duration)}
        </Typography>
      </Box>
    </Box>
  );
};

export default ReelPlayer;