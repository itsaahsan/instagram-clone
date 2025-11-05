import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Avatar,
  Fab,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Share,
  MoreVert,
  VolumeUp,
  VolumeOff,
  VideoLibrary,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { mockPosts } from '@/data/mockData';
import ReelPlayer from '@/components/reels/ReelPlayer';

const ReelsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Create proper reels data with working video URLs
  const reels = mockPosts.map((post, index) => ({
    ...post,
    videoUrl: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`, // Working demo video
    isVideo: true,
    duration: 15 + (index * 5), // Different durations
    viewsCount: Math.floor(Math.random() * 100000) + 1000,
  }));

  useEffect(() => {
    const handleScroll = () => {
      if (!isMobile) return;
      
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const newIndex = Math.floor(scrollY / windowHeight);
      
      if (newIndex !== currentReelIndex && newIndex < reels.length && newIndex >= 0) {
        setCurrentReelIndex(newIndex);
        // Pause all videos except current one
        videoRefs.current.forEach((video, idx) => {
          if (video) {
            if (idx === newIndex) {
              video.play();
            } else {
              video.pause();
            }
          }
        });
      }
    };

    if (isMobile) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [currentReelIndex, reels.length, isMobile]);

  useEffect(() => {
    // Auto-play first video on mount
    if (videoRefs.current[0]) {
      videoRefs.current[0].play();
    }
  }, []);

  const handleVideoClick = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleLike = (reelId: string) => {
    // Handle like logic - update the reel's like status
    const updatedReels = reels.map(reel => {
      if (reel.id === reelId) {
        return {
          ...reel,
          isLiked: !reel.isLiked,
          likesCount: reel.isLiked ? reel.likesCount - 1 : reel.likesCount + 1
        };
      }
      return reel;
    });
    // In a real app, this would make an API call and update state properly
  };

  const handleComment = (reelId: string) => {
    navigate(`/p/${reelId}`);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRefs.current.forEach(video => {
      if (video) {
        video.muted = !isMuted;
      }
    });
  };

  const ReelCard: React.FC<{ reel: typeof reels[0]; index: number }> = ({ reel, index }) => {
  const [localIsPlaying, setLocalIsPlaying] = useState(index === currentReelIndex);
  const [localIsLiked, setLocalIsLiked] = useState(reel.isLiked);
  const [localLikesCount, setLocalLikesCount] = useState(reel.likesCount);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalIsLiked(!localIsLiked);
    setLocalLikesCount(prev => localIsLiked ? prev - 1 : prev + 1);
    handleLike(reel.id);
  };

  const handleVideoClick = () => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
        setLocalIsPlaying(true);
      } else {
        video.pause();
        setLocalIsPlaying(false);
      }
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: isMobile ? '100vh' : 600,
        width: isMobile ? '100vw' : 350,
        backgroundColor: 'black',
        borderRadius: isMobile ? 0 : 2,
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onClick={handleVideoClick}
    >
      {/* Video Element */}
      <video
        ref={(el) => (videoRefs.current[index] = el)}
        src={reel.videoUrl}
        poster={reel.imageUrl}
        muted={isMuted}
        loop
        playsInline
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        onLoadedData={() => {
          // Auto-play current video
          if (index === currentReelIndex) {
            setTimeout(() => {
              const video = videoRefs.current[index];
              if (video) {
                video.play().then(() => {
                  setLocalIsPlaying(true);
                }).catch(() => {
                  // Handle autoplay restrictions
                  setLocalIsPlaying(false);
                });
              }
            }, 100);
          }
        }}
        onPlay={() => {
          setLocalIsPlaying(true);
          setIsPlaying(true);
        }}
        onPause={() => {
          setLocalIsPlaying(false);
          setIsPlaying(false);
        }}
      />

      {/* Play/Pause Overlay */}
      {!localIsPlaying && index === currentReelIndex && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: '50%',
            padding: 2,
            zIndex: 2,
          }}
        >
          <PlayArrow sx={{ fontSize: 48, color: 'white' }} />
        </Box>
      )}

      {/* Right Side Actions */}
      <Box
        sx={{
          position: 'absolute',
          right: 16,
          bottom: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          alignItems: 'center',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <IconButton
            onClick={handleLikeClick}
            sx={{ color: 'white', mb: 1 }}
          >
            {localIsLiked ? (
              <Favorite sx={{ fontSize: 32, color: '#ff3040' }} />
            ) : (
              <FavoriteBorder sx={{ fontSize: 32 }} />
            )}
          </IconButton>
          <Typography variant="caption" sx={{ color: 'white', display: 'block' }}>
            {localLikesCount}
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleComment(reel.id);
            }}
            sx={{ color: 'white', mb: 1 }}
          >
            <ChatBubbleOutline sx={{ fontSize: 32 }} />
          </IconButton>
          <Typography variant="caption" sx={{ color: 'white', display: 'block' }}>
            {reel.commentsCount}
          </Typography>
        </Box>

        <IconButton sx={{ color: 'white' }}>
          <Share sx={{ fontSize: 32 }} />
        </IconButton>

        <IconButton sx={{ color: 'white' }}>
          <MoreVert sx={{ fontSize: 32 }} />
        </IconButton>

        <Avatar
          src={reel.user.profilePicture}
          alt={reel.user.displayName}
          sx={{ width: 40, height: 40, border: '2px solid white' }}
        />
      </Box>

      {/* Bottom Content */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 80,
          p: 2,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar
            src={reel.user.profilePicture}
            alt={reel.user.displayName}
            sx={{ width: 32, height: 32, mr: 2 }}
          />
          <Typography variant="subtitle2" fontWeight={600}>
            {reel.user.username}
          </Typography>
          <Box
            component="button"
            sx={{
              ml: 2,
              color: 'white',
              borderColor: 'white',
              border: '1px solid white',
              borderRadius: 1,
              px: 2,
              py: 0.5,
              backgroundColor: 'transparent',
              fontSize: '0.875rem',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Follow
          </Box>
        </Box>
        
        <Typography variant="body2" sx={{ mb: 1 }}>
          {reel.caption}
        </Typography>
        
        {reel.location && (
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            📍 {typeof reel.location === 'string' ? reel.location : reel.location?.name}
          </Typography>
        )}
      </Box>

      {/* Volume Control */}
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          toggleMute();
        }}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}
      >
        {isMuted ? <VolumeOff /> : <VolumeUp />}
      </IconButton>
    </Box>
  );
};

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 0 : 2,
        justifyContent: 'center',
        alignItems: isMobile ? 'stretch' : 'flex-start',
        minHeight: '100vh',
        backgroundColor: isMobile ? 'black' : 'background.default',
        overflow: isMobile ? 'visible' : 'hidden',
        position: 'relative',
      }}
    >
      {reels.map((reel, index) => (
        <ReelCard key={reel.id} reel={reel} index={index} />
      ))}

      {/* Create Reel FAB */}
      <Fab
        color="primary"
        aria-label="create reel"
        sx={{
          position: 'fixed',
          bottom: isMobile ? 80 : 16,
          right: 16,
          zIndex: 1000,
        }}
        onClick={() => navigate('/create?type=reel')}
      >
        <VideoLibrary />
      </Fab>
    </Box>
  );
};

export default ReelsPage;