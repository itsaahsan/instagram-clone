import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  Typography,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mockPosts, mockUsers } from '@/data/mockData';
import { Post, User } from '@/types';

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [tabValue, setTabValue] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    } else {
      loadExploreContent();
    }
  }, [searchQuery]);

  const loadExploreContent = async () => {
    setLoading(true);
    try {
      // Load trending posts
      const shuffledPosts = [...mockPosts].sort(() => Math.random() - 0.5);
      setPosts(shuffledPosts);
      
      // Load suggested users
      setUsers(mockUsers.slice(0, 10));
      
      // Extract popular tags
      const allTags = mockPosts.flatMap(post => post.tags);
      const tagCounts = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const popularTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 20)
        .map(([tag]) => tag);
      
      setTags(popularTags);
    } catch (error) {
      // Error loading explore content - would handle with proper error state
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadExploreContent();
      return;
    }

    setLoading(true);
    try {
      const query = searchQuery.toLowerCase();
      
      // Search posts
      const filteredPosts = mockPosts.filter(post =>
        post.caption.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)) ||
        post.user.displayName.toLowerCase().includes(query)
      );
      setPosts(filteredPosts);
      
      // Search users
      const filteredUsers = mockUsers.filter(user =>
        user.displayName.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.bio?.toLowerCase().includes(query)
      );
      setUsers(filteredUsers);
      
      // Search tags
      const filteredTags = tags.filter(tag =>
        tag.toLowerCase().includes(query)
      );
      setTags(filteredTags);
    } catch (error) {
      // Error searching - would handle with proper error state
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handlePostClick = (postId: string) => {
    navigate(`/p/${postId}`);
  };

  const handleUserClick = (username: string) => {
    navigate(`/${username}`);
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(`#${tag}`);
    setSearchParams({ q: `#${tag}` });
  };

  const renderPostsGrid = () => (
    <Grid container spacing={1}>
      {posts.map((post) => (
        <Grid item xs={4} sm={3} md={2.4} key={post.id}>
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

  const renderUsersList = () => (
    <List>
      {users.map((user) => (
        <ListItem
          key={user.id}
          sx={{ cursor: 'pointer' }}
          onClick={() => handleUserClick(user.username)}
        >
          <ListItemAvatar>
            <Avatar src={user.profilePicture} alt={user.displayName}>
              {user.displayName?.charAt(0)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {user.displayName}
                {user.verified && (
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 'bold',
                    }}
                  >
                    ✓
                  </Box>
                )}
              </Box>
            }
            secondary={
              <Box>
                <Typography variant="body2" color="text.secondary">
                  @{user.username} • {user.followersCount.toLocaleString()} followers
                </Typography>
                {user.bio && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {user.bio}
                  </Typography>
                )}
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );

  const renderTagsList = () => (
    <Box sx={{ p: 2 }}>
      {tags.map((tag) => (
        <Chip
          key={tag}
          label={`#${tag}`}
          onClick={() => handleTagClick(tag)}
          sx={{ m: 0.5, cursor: 'pointer' }}
          variant="outlined"
        />
      ))}
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      {/* Search Bar */}
      <Box
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{ mb: 3 }}
      >
        <TextField
          fullWidth
          placeholder="Search posts, users, and tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
      </Box>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label={`Posts (${posts.length})`} />
        <Tab label={`Users (${users.length})`} />
        <Tab label={`Tags (${tags.length})`} />
      </Tabs>

      {/* Content */}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      ) : (
        <Box>
          {tabValue === 0 && (
            posts.length === 0 ? (
              <Typography sx={{ textAlign: 'center', py: 4 }}>
                No posts found
              </Typography>
            ) : (
              renderPostsGrid()
            )
          )}
          
          {tabValue === 1 && (
            users.length === 0 ? (
              <Typography sx={{ textAlign: 'center', py: 4 }}>
                No users found
              </Typography>
            ) : (
              renderUsersList()
            )
          )}
          
          {tabValue === 2 && (
            tags.length === 0 ? (
              <Typography sx={{ textAlign: 'center', py: 4 }}>
                No tags found
              </Typography>
            ) : (
              renderTagsList()
            )
          )}
        </Box>
      )}
    </Box>
  );
};

export default ExplorePage;