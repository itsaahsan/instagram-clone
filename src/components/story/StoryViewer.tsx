import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Avatar,
  LinearProgress,
  TextField,
  Dialog,
  Slide,
} from '@mui/material';
import {
  Close,
  ArrowBackIos,
  ArrowForwardIos,
  FavoriteBorder,
  Favorite,
  Send,
  MoreVert,
  VolumeUp,
  VolumeOff,
  Pause,
  PlayArrow,
} from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { Story, User } from '@/types';
import { formatDistanceToNow } from 'date-fns';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface StoryViewerProps {
  open: boolean;
  onClose: () => void;
  stories: Story[];
  initialStoryIndex?: number;
  initialUserIndex?: number;
}

interface StoryProgress {
  currentUserIndex: number;
  currentStoryIndex: number;
  progress: number;
  isPaused: boolean;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  open,
  onClose,
  stories,
  initialStoryIndex = 0,
  initialUserIndex = 0,
}) => {
  const [storyProgress, setStoryProgress] = useState<StoryProgress>({
    currentUserIndex: initialUserIndex,
    currentStoryIndex: initialStoryIndex,
    progress: 0,
    isPaused: false,
  });
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const progressRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const storyDuration = 5000; // 5 seconds per story

  // Group stories by user
  const groupedStories = stories.reduce((acc, story) => {
    const userId = story.user.id;
    if (!acc[userId]) {
      acc[userId] = {
        user: story.user,
        stories: [],
      };
    }
    acc[userId].stories.push(story);
    return acc;
  }, {} as Record<string, { user: User; stories: Story[] }>);

  const userGroups = Object.values(groupedStories);
  const currentUser = userGroups[storyProgress.currentUserIndex];
  const currentStory = currentUser?.stories[storyProgress.currentStoryIndex];

  useEffect(() => {
    if (!open || storyProgress.isPaused) return;

    progressRef.current = setInterval(() => {
      setStoryProgress(prev => {
        const newProgress = prev.progress + (100 / (storyDuration / 100));
        
        if (newProgress >= 100) {
          // Move to next story
          const nextStoryIndex = prev.currentStoryIndex + 1;
          const currentUserStories = userGroups[prev.currentUserIndex]?.stories || [];
          
          if (nextStoryIndex < currentUserStories.length) {
            // Next story of same user
            return {
              ...prev,
              currentStoryIndex: nextStoryIndex,
              progress: 0,
            };
          } else {
            // Next user's first story
            const nextUserIndex = prev.currentUserIndex + 1;
            if (nextUserIndex < userGroups.length) {
              return {
                ...prev,
                currentUserIndex: nextUserIndex,
                currentStoryIndex: 0,
                progress: 0,
              };
            } else {
              // End of all stories
              onClose();
              return prev;
            }
          }
        }
        
        return { ...prev, progress: newProgress };
      });
    }, 100);

    return () => {
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
    };
  }, [open, storyProgress.isPaused, storyProgress.currentUserIndex, storyProgress.currentStoryIndex, userGroups.length, onClose]);

  const handlePrevious = () => {
    setStoryProgress(prev => {
      if (prev.currentStoryIndex > 0) {
        return {
          ...prev,
          currentStoryIndex: prev.currentStoryIndex - 1,
          progress: 0,
        };
      } else if (prev.currentUserIndex > 0) {
        const prevUserStories = userGroups[prev.currentUserIndex - 1]?.stories || [];
        return {
          ...prev,
          currentUserIndex: prev.currentUserIndex - 1,
          currentStoryIndex: prevUserStories.length - 1,
          progress: 0,
        };
      }
      return prev;
    });
  };

  const handleNext = () => {
    setStoryProgress(prev => {
      const currentUserStories = userGroups[prev.currentUserIndex]?.stories || [];
      const nextStoryIndex = prev.currentStoryIndex + 1;
      
      if (nextStoryIndex < currentUserStories.length) {
        return {
          ...prev,
          currentStoryIndex: nextStoryIndex,
          progress: 0,
        };
      } else {
        const nextUserIndex = prev.currentUserIndex + 1;
        if (nextUserIndex < userGroups.length) {
          return {
            ...prev,
            currentUserIndex: nextUserIndex,
            currentStoryIndex: 0,
            progress: 0,
          };
        } else {
          onClose();
          return prev;
        }
      }
    });
  };

  const handlePauseToggle = () => {
    setStoryProgress(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Here you would typically send the like to your backend
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    
    // Here you would typically send the reply to your backend
    // For demo purposes, we'll just clear the input
    setReplyText('');
    setShowReplyInput(false);
  };

  const handleStoryClick = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const halfWidth = rect.width / 2;
    
    if (clickX < halfWidth) {
      handlePrevious();
    } else {
      handleNext();
    }
  };

  if (!currentStory || !currentUser) {
    return null;
  }

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      PaperProps={{
        sx: { height: '100vh', maxHeight: '800px' }
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          backgroundColor: '#000',
        }}
      >
        {/* Progress Bars */}
        {currentUser && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              p: 1,
              display: 'flex',
              gap: 0.5,
            }}
          >
            {currentUser.stories.map((_, index) => (
              <Box key={index} sx={{ flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.3)' }}>
                <LinearProgress
                  variant="determinate"
                  value={
                    index < storyProgress.currentStoryIndex
                      ? 100
                      : index === storyProgress.currentStoryIndex
                      ? storyProgress.progress
                      : 0
                  }
                  sx={{
                    height: '100%',
                    backgroundColor: 'transparent',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'white',
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
        )}

        {/* Header */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            p: 2,
            pt: 4,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={currentUser.user.profilePicture}
              alt={currentUser.user.displayName}
              sx={{ width: 32, height: 32 }}
            >
              {currentUser.user.displayName?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {currentUser.user.displayName}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {formatDistanceToNow(new Date(currentStory.createdAt), { addSuffix: true })}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              sx={{ color: 'white' }}
              onClick={handlePauseToggle}
            >
              {storyProgress.isPaused ? <PlayArrow /> : <Pause />}
            </IconButton>
            {currentStory.mediaType === 'video' && (
              <IconButton
                size="small"
                sx={{ color: 'white' }}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeOff /> : <VolumeUp />}
              </IconButton>
            )}
            <IconButton size="small" sx={{ color: 'white' }}>
              <MoreVert />
            </IconButton>
            <IconButton size="small" sx={{ color: 'white' }} onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>

        {/* Story Content */}
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backgroundColor: currentStory.backgroundColor || '#000',
          }}
          onClick={handleStoryClick}
        >
          {/* Background Image for text-only stories */}
          {currentStory.mediaType === 'image' && !currentStory.text && (
            <Box
              component="img"
              src={currentStory.mediaUrl}
              alt=""
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}

          {/* Main Content */}
          {currentStory.mediaType === 'video' ? (
            <video
              src={currentStory.mediaUrl}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'cover',
                width: '100%',
                height: '100%',
              }}
            />
          ) : (
            <Box
              component="img"
              src={currentStory.mediaUrl}
              alt=""
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: 2,
                width: '100%',
                height: '100%',
              }}
            />
          )}

          {/* Story Text Overlay */}
          {currentStory.text && (
            <Box
              sx={{
                position: 'absolute',
                bottom: '20%',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                backgroundColor: currentStory.backgroundColor || 'rgba(0,0,0,0.5)',
                borderRadius: 2,
                p: 2,
                maxWidth: '80%',
              }}
            >
              <Typography variant="h6" sx={{ color: 'white' }}>
                {currentStory.text}
              </Typography>
            </Box>
          )}

          {/* Navigation Areas */}
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '20%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              pl: 2,
            }}
          >
            {(storyProgress.currentStoryIndex > 0 || storyProgress.currentUserIndex > 0) && (
              <IconButton
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
              >
                <ArrowBackIos />
              </IconButton>
            )}
          </Box>

          <Box
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '20%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              pr: 2,
            }}
          >
            <IconButton
              sx={{
                color: 'white',
                backgroundColor: 'rgba(0,0,0,0.3)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' },
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
            >
              <ArrowForwardIos />
            </IconButton>
          </Box>
        </Box>

        {/* Bottom Actions */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {showReplyInput ? (
            <Box sx={{ display: 'flex', flex: 1, gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder={`Reply to ${currentUser.user.displayName}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleReply()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: 'white' },
                  },
                  '& .MuiOutlinedInput-input::placeholder': {
                    color: 'rgba(255,255,255,0.7)',
                  },
                }}
              />
              <IconButton
                sx={{ color: 'white' }}
                onClick={handleReply}
                disabled={!replyText.trim()}
              >
                <Send />
              </IconButton>
            </Box>
          ) : (
            <>
              <TextField
                size="small"
                placeholder={`Send message to ${currentUser.user.displayName}...`}
                onClick={() => setShowReplyInput(true)}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  },
                  '& .MuiOutlinedInput-input::placeholder': {
                    color: 'rgba(255,255,255,0.7)',
                  },
                }}
                InputProps={{ readOnly: true }}
              />
              <IconButton sx={{ color: 'white' }} onClick={handleLike}>
                {isLiked ? (
                  <Favorite sx={{ color: '#ff3040' }} />
                ) : (
                  <FavoriteBorder />
                )}
              </IconButton>
            </>
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

export default StoryViewer;