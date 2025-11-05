import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Grid,
  Card,
  CardMedia,
  Tabs,
  Tab,
  IconButton,
  Chip,
} from '@mui/material';
import {
  PersonAdd,
  Message,
  MoreVert,
  GridOn,
  PlayArrow,
  Favorite,
  ChatBubbleOutline,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { mockUsers, mockPosts } from '@/data/mockData';
import { User, Post } from '@/types';
import toast from 'react-hot-toast';

const UserProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (username) {
      const foundUser = mockUsers.find(u => u.username === username);
      if (foundUser) {
        setUser(foundUser);
        loadUserPosts(foundUser.id);
        setIsFollowing(Math.random() > 0.5); // Random for demo
      } else {
        navigate('/');
      }
    }
  }, [username, navigate]);

  const loadUserPosts = (userId: string) => {
    const userPosts = mockPosts.filter(post => post.userId === userId);
    setPosts(userPosts);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // Update follower count
    if (user) {
      setUser({
        ...user,
        followersCount: isFollowing 
          ? user.followersCount - 1 
          : user.followersCount + 1,
      });
    }
    toast.success(isFollowing ? `Unfollowed ${user?.displayName}` : `Now following ${user?.displayName}`);
  };

  const handleMessage = () => {
    navigate(`/messages/${user?.username}`);
  };

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>User not found</Typography>
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
                <Chip
                  label="✓"
                  size="small"
                  color="primary"
                  sx={{ minWidth: 'auto', '& .MuiChip-label': { px: 1 } }}
                />
              )}
              <Button
                variant={isFollowing ? "outlined" : "contained"}
                size="small"
                startIcon={<PersonAdd />}
                onClick={handleFollow}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Message />}
                onClick={handleMessage}
              >
                Message
              </Button>
              <IconButton>
                <MoreVert />
              </IconButton>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
              <Typography>
                <strong>{posts.length}</strong> posts
              </Typography>
              <Typography>
                <strong>{user.followersCount.toLocaleString()}</strong> followers
              </Typography>
              <Typography>
                <strong>{user.followingCount.toLocaleString()}</strong> following
              </Typography>
            </Box>
            
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
      </Tabs>

      {/* Posts Grid */}
      <Box>
        {posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Posts Yet
            </Typography>
            <Typography color="text.secondary">
              {user.displayName} hasn't shared any posts yet.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={1}>
            {posts.map((post) => (
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
                  onClick={() => navigate(`/p/${post.id}`)}
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
                      <Favorite sx={{ fontSize: 16 }} />
                      {post.likesCount}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ChatBubbleOutline sx={{ fontSize: 16 }} />
                      {post.commentsCount}
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default UserProfilePage;