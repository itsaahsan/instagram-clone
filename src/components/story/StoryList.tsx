import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Card,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { Story } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import StoryViewer from './StoryViewer';

interface StoryListProps {
  stories: Story[];
}

const StoryList: React.FC<StoryListProps> = ({ stories }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [initialStoryIndex, setInitialStoryIndex] = useState(0);

  const handleStoryClick = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setInitialStoryIndex(index);
    setShowStoryViewer(true);
  };

  const handleAddStory = () => {
    navigate('/create?type=story');
  };

  if (stories.length === 0 && user) {
    return (
      <Card sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={user.profilePicture}
              alt={user.displayName}
              sx={{ width: 56, height: 56, cursor: 'pointer' }}
              onClick={handleAddStory}
            >
              {user.displayName?.charAt(0)}
            </Avatar>
            <IconButton
              size="small"
              onClick={handleAddStory}
              sx={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                backgroundColor: 'primary.main',
                color: 'white',
                width: 20,
                height: 20,
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              <Add sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              Your story
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Share a photo or video
            </Typography>
          </Box>
        </Box>
      </Card>
    );
  }

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            p: 2,
            overflowX: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}
        >
          {/* Add Story */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 80,
              cursor: 'pointer',
            }}
            onClick={handleAddStory}
          >
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={user?.profilePicture}
                alt={user?.displayName}
                sx={{ width: 64, height: 64 }}
              >
                {user?.displayName?.charAt(0)}
              </Avatar>
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  width: 20,
                  height: 20,
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                <Add sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                textAlign: 'center',
                fontWeight: 500,
                maxWidth: 80,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              Your story
            </Typography>
          </Box>

          {/* Stories */}
          {stories.map((story) => (
            <Box
            key={story.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 80,
              cursor: 'pointer',
              position: 'relative',
            }}
            onClick={(e) => handleStoryClick(index, e)}
            onMouseEnter={(e) => {
              // Add hover effect
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
              <Box
                sx={{
                  padding: '2px',
                  borderRadius: '50%',
                  background: story.isViewed
                    ? 'linear-gradient(45deg, #c7c7c7, #8e8e8e)'
                    : 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                }}
              >
                <Avatar
                  src={story.user.profilePicture}
                  alt={story.user.displayName}
                  sx={{
                    width: 64,
                    height: 64,
                    border: '2px solid white',
                  }}
                >
                  {story.user.displayName?.charAt(0)}
                </Avatar>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  textAlign: 'center',
                  fontWeight: 500,
                  maxWidth: 80,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {story.user.displayName}
              </Typography>
            </Box>
          ))}
        </Box>
      </Card>

      {/* Story Viewer */}
      <StoryViewer
        open={showStoryViewer}
        onClose={() => setShowStoryViewer(false)}
        stories={stories}
        initialStoryIndex={initialStoryIndex}
      />
    </>
  );
};

export default StoryList;