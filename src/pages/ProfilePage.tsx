import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  Typography,
  Avatar,
  Button,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import { 
  Settings, 
  GridOn, 
  Bookmark, 
  PlayArrow,
  PersonAdd,
  Share,
  MoreVert,
  Favorite,
  ChatBubbleOutline,
  Visibility,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { mockPosts, mockStories } from '@/data/mockData';
import { Post, Story } from '@/types';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [reelPosts, setReelPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    loadUserPosts();
    loadSavedPosts();
    loadUserStories();
    loadUserReels();
  }, [user]);

  const loadUserPosts = () => {
    // Filter posts by current user
    const userPosts = mockPosts.filter(post => post.userId === user?.id);
    setPosts(userPosts);
  };

  const loadSavedPosts = () => {
    // Filter saved posts (in real app, this would come from user's saved posts)
    const saved = mockPosts.filter(post => post.isSaved);
    setSavedPosts(saved);
  };

  const loadUserStories = () => {
    // Filter stories by current user
    const userStories = mockStories.filter(story => story.userId === user?.id);
    setStories(userStories);
  };

  const loadUserReels = () => {
    // Filter posts that could be reels (posts with video content)
    const userReels = mockPosts.filter(post => 
      post.userId === user?.id && (post.videoUrl || Math.random() > 0.7)
    );
    setReelPosts(userReels);
  };

  const handlePostClick = (postId: string) => {
    navigate(`/p/${postId}`);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderPostsGrid = (postsToRender: Post[]) => (
    <Grid container spacing={1}>
      {postsToRender.map((post) => (
        <Grid item xs={4} key={post.id}>
          <Card
            sx={{
              aspectRatio: '1',
              cursor: 'pointer',
              position: 'relative',
              '&:hover': {
                '& .overlay': {
                  opacity: 1,
                },
              },
            }}
            onClick={() => handlePostClick(post.id)}
          >
            <CardMedia
              component="img"
              image={post.imageUrl}
              alt={post.caption}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <Box
              className="overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.2s',
                color: 'white',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                ❤️ {post.likesCount}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                💬 {post.commentsCount}
              </Box>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Profile Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 4, mb: 3, alignItems: 'flex-start' }}>
          <Avatar
            src={user.profilePicture}
            alt={user.displayName}
            sx={{ width: 120, height: 120 }}
          >
            {user.displayName?.charAt(0)}
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h5" fontWeight={300}>
                {user.username}
              </Typography>
              {user.verified && (
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  ✓
                </Box>
              )}
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/settings')}
              >
                Edit profile
              </Button>
              <IconButton onClick={handleMenuOpen}>
                <Settings />
              </IconButton>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
              <Box 
                sx={{ cursor: 'pointer' }}
                onClick={() => setShowStats(!showStats)}
              >
                <Typography>
                  <strong>{posts.length}</strong> posts
                </Typography>
              </Box>
              <Box sx={{ cursor: 'pointer' }}>
                <Typography>
                  <strong>{user.followersCount.toLocaleString()}</strong> followers
                </Typography>
              </Box>
              <Box sx={{ cursor: 'pointer' }}>
                <Typography>
                  <strong>{user.followingCount.toLocaleString()}</strong> following
                </Typography>
              </Box>
            </Box>

            {/* Enhanced Stats */}
            {showStats && (
              <Paper sx={{ p: 2, mb: 2, backgroundColor: 'background.paper' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Account Insights
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Profile views (last 7 days)
                    </Typography>
                    <Typography variant="h6">
                      {Math.floor(Math.random() * 1000) + 500}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total likes
                    </Typography>
                    <Typography variant="h6">
                      {posts.reduce((sum, post) => sum + post.likesCount, 0).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total comments
                    </Typography>
                    <Typography variant="h6">
                      {posts.reduce((sum, post) => sum + post.commentsCount, 0).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )}
            
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {user.displayName}
              </Typography>
              {user.bio && (
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {user.bio}
                </Typography>
              )}
              {user.website && (
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ mt: 0.5, cursor: 'pointer' }}
                  onClick={() => window.open(user.website, '_blank')}
                >
                  {user.website}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Story Highlights */}
      {stories.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Story Highlights
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
            {stories.map((story) => (
              <Box key={story.id} sx={{ textAlign: 'center', minWidth: 80 }}>
                <Avatar
                  src={story.mediaUrl}
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    mb: 1,
                    border: '2px solid',
                    borderColor: story.isViewed ? 'grey.300' : 'primary.main',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/stories/${story.userId}`)}
                />
                <Typography variant="caption" color="text.secondary">
                  {story.text?.substring(0, 10) || 'Story'}
                </Typography>
              </Box>
            ))}
            {/* Add new story highlight */}
            <Box sx={{ textAlign: 'center', minWidth: 80 }}>
              <Avatar
                sx={{ 
                  width: 64, 
                  height: 64, 
                  mb: 1,
                  backgroundColor: 'grey.100',
                  cursor: 'pointer',
                  border: '2px dashed',
                  borderColor: 'grey.300',
                }}
              >
                +
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                New
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        centered
        sx={{ mb: 3, borderTop: 1, borderColor: 'divider' }}
      >
        <Tab
          icon={<GridOn />}
          label="POSTS"
          sx={{ textTransform: 'none', fontWeight: 600 }}
        />
        <Tab
          icon={<PlayArrow />}
          label="REELS"
          sx={{ textTransform: 'none', fontWeight: 600 }}
        />
        <Tab
          icon={<Bookmark />}
          label="SAVED"
          sx={{ textTransform: 'none', fontWeight: 600 }}
        />
      </Tabs>

      {/* Content */}
      <Box>
        {/* Posts Tab */}
        {tabValue === 0 && (
          posts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Posts Yet
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                When you share photos and videos, they will appear on your profile.
              </Typography>
              <Button variant="text" onClick={() => navigate('/create')}>
                Share your first photo
              </Button>
            </Box>
          ) : (
            renderPostsGrid(posts)
          )
        )}
        
        {/* Reels Tab */}
        {tabValue === 1 && (
          reelPosts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Reels Yet
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Create your first reel to share short videos.
              </Typography>
              <Button variant="text" onClick={() => navigate('/create?type=reel')}>
                Create your first reel
              </Button>
            </Box>
          ) : (
            <Grid container spacing={1}>
              {reelPosts.map((reel) => (
                <Grid item xs={4} key={reel.id}>
                  <Card
                    sx={{
                      aspectRatio: '9/16',
                      cursor: 'pointer',
                      position: 'relative',
                      '&:hover': {
                        '& .overlay': {
                          opacity: 1,
                        },
                      },
                    }}
                    onClick={() => navigate(`/reels?id=${reel.id}`)}
                  >
                    <CardMedia
                      component="img"
                      image={reel.imageUrl}
                      alt={reel.caption}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {/* Reel indicator */}
                    <PlayArrow
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'white',
                        fontSize: 20,
                      }}
                    />
                    <Box
                      className="overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        color: 'white',
                        gap: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Visibility sx={{ fontSize: 16 }} />
                        {reel.viewsCount?.toLocaleString() || '0'}
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )
        )}
        
        {/* Saved Tab */}
        {tabValue === 2 && (
          savedPosts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Saved Posts
              </Typography>
              <Typography color="text.secondary">
                Save posts you want to see again.
              </Typography>
            </Box>
          ) : (
            renderPostsGrid(savedPosts)
          )
        )}
      </Box>

      {/* Settings Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
          Settings
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate('/settings/privacy'); }}>
          Privacy
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>Help</MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfilePage;