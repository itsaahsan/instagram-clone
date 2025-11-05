import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Avatar,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Search,
  VideoLibrary,
  Favorite,
  ChatBubbleOutline,
  LocationOn,
  Tag,
  Person,
  Close,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Post, User } from '@/types';
import { mockPosts, mockUsers } from '@/data/mockData';

interface ExploreGridProps {
  onPostClick?: (post: Post) => void;
}

interface SearchResult {
  posts: Post[];
  users: User[];
  hashtags: { name: string; count: number }[];
  locations: { name: string; count: number }[];
}

const TRENDING_HASHTAGS = [
  { name: 'sunset', count: 12500 },
  { name: 'travel', count: 98000 },
  { name: 'foodie', count: 45000 },
  { name: 'photography', count: 67000 },
  { name: 'fitness', count: 34000 },
  { name: 'nature', count: 78000 },
  { name: 'art', count: 23000 },
  { name: 'lifestyle', count: 56000 },
];

const TRENDING_LOCATIONS = [
  { name: 'New York, NY', count: 156000 },
  { name: 'Los Angeles, CA', count: 143000 },
  { name: 'Paris, France', count: 234000 },
  { name: 'Tokyo, Japan', count: 187000 },
  { name: 'London, UK', count: 165000 },
];

const ExploreGrid: React.FC<ExploreGridProps> = ({ onPostClick }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Create explore posts with different engagement patterns
  const explorePosts = mockPosts.map((post, index) => ({
    ...post,
    // Simulate algorithmic sorting based on engagement
    engagementScore: post.likesCount + post.commentsCount * 2 + (post.viewsCount || 0) * 0.1,
    category: ['trending', 'art', 'travel', 'food', 'fitness', 'nature'][index % 6],
  })).sort((a, b) => b.engagementScore - a.engagementScore);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Simulate API search delay
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();

      const filteredPosts = mockPosts.filter(post =>
        post.caption.toLowerCase().includes(lowerQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        post.user.displayName.toLowerCase().includes(lowerQuery)
      );

      const filteredUsers = mockUsers.filter(user =>
        user.username.toLowerCase().includes(lowerQuery) ||
        user.displayName.toLowerCase().includes(lowerQuery) ||
        user.bio?.toLowerCase().includes(lowerQuery)
      );

      const hashtags = TRENDING_HASHTAGS.filter(tag =>
        tag.name.toLowerCase().includes(lowerQuery)
      );

      const locations = TRENDING_LOCATIONS.filter(location =>
        location.name.toLowerCase().includes(lowerQuery)
      );

      setSearchResults({
        posts: filteredPosts,
        users: filteredUsers,
        hashtags,
        locations,
      });
      setIsSearching(false);
    }, 500);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const handlePostClick = (post: Post) => {
    if (onPostClick) {
      onPostClick(post);
    } else {
      setSelectedPost(post);
    }
  };

  const renderPostGrid = (posts: Post[]) => (
    <Grid container spacing={1}>
      {posts.map((post, index) => (
        <Grid item xs={4} key={post.id}>
          <Card
            sx={{
              aspectRatio: '1',
              position: 'relative',
              cursor: 'pointer',
              '&:hover': {
                '& .overlay': { opacity: 1 },
              },
            }}
            onClick={() => handlePostClick(post)}
          >
            <CardMedia
              component="img"
              image={post.imageUrl}
              alt={post.caption}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            
            {/* Video indicator */}
            {post.videoUrl && (
              <VideoLibrary
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: 'white',
                  filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))',
                }}
              />
            )}

            {/* Carousel indicator */}
            {post.isCarousel && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                }}
              >
                1/{post.imageUrls?.length || 1}
              </Box>
            )}

            {/* Hover overlay */}
            <Box
              className="overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <Favorite sx={{ mr: 0.5 }} />
                <Typography variant="body2" fontWeight="bold">
                  {formatCount(post.likesCount)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <ChatBubbleOutline sx={{ mr: 0.5 }} />
                <Typography variant="body2" fontWeight="bold">
                  {formatCount(post.commentsCount)}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box>
      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Search Results */}
      {searchResults ? (
        <Box>
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            sx={{ mb: 3 }}
          >
            <Tab label={`Posts (${searchResults.posts.length})`} />
            <Tab label={`People (${searchResults.users.length})`} />
            <Tab label={`Tags (${searchResults.hashtags.length})`} />
            <Tab label={`Places (${searchResults.locations.length})`} />
          </Tabs>

          {/* Posts Tab */}
          {activeTab === 0 && (
            <Box>
              {searchResults.posts.length > 0 ? (
                renderPostGrid(searchResults.posts)
              ) : (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  No posts found
                </Typography>
              )}
            </Box>
          )}

          {/* People Tab */}
          {activeTab === 1 && (
            <Box>
              {searchResults.users.length > 0 ? (
                <Grid container spacing={2}>
                  {searchResults.users.map((user) => (
                    <Grid item xs={12} sm={6} md={4} key={user.id}>
                      <Card sx={{ p: 2, cursor: 'pointer' }} onClick={() => navigate(`/${user.username}`)}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            src={user.profilePicture}
                            alt={user.displayName}
                            sx={{ width: 50, height: 50, mr: 2 }}
                          />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle2" fontWeight="bold" noWrap>
                              {user.displayName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              @{user.username}
                            </Typography>
                          </Box>
                        </Box>
                        {user.bio && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {user.bio}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          <Typography variant="caption">
                            <strong>{formatCount(user.postsCount)}</strong> posts
                          </Typography>
                          <Typography variant="caption">
                            <strong>{formatCount(user.followersCount)}</strong> followers
                          </Typography>
                        </Box>
                        <Button variant="contained" size="small" fullWidth>
                          Follow
                        </Button>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  No users found
                </Typography>
              )}
            </Box>
          )}

          {/* Tags Tab */}
          {activeTab === 2 && (
            <Box>
              {searchResults.hashtags.length > 0 ? (
                <Grid container spacing={2}>
                  {searchResults.hashtags.map((hashtag) => (
                    <Grid item xs={12} sm={6} md={4} key={hashtag.name}>
                      <Card sx={{ p: 2, cursor: 'pointer' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Tag sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="h6">
                            #{hashtag.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {formatCount(hashtag.count)} posts
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  No hashtags found
                </Typography>
              )}
            </Box>
          )}

          {/* Places Tab */}
          {activeTab === 3 && (
            <Box>
              {searchResults.locations.length > 0 ? (
                <Grid container spacing={2}>
                  {searchResults.locations.map((location) => (
                    <Grid item xs={12} sm={6} md={4} key={location.name}>
                      <Card sx={{ p: 2, cursor: 'pointer' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="subtitle1">
                            {location.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {formatCount(location.count)} posts
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  No locations found
                </Typography>
              )}
            </Box>
          )}
        </Box>
      ) : (
        /* Default Explore Content */
        <Box>
          {/* Trending Section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Trending</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
              {TRENDING_HASHTAGS.slice(0, 8).map((hashtag) => (
                <Chip
                  key={hashtag.name}
                  label={`#${hashtag.name}`}
                  variant="outlined"
                  size="small"
                  onClick={() => setSearchQuery(hashtag.name)}
                />
              ))}
            </Box>
          </Box>

          {/* Explore Posts Grid */}
          {renderPostGrid(explorePosts)}
        </Box>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <Dialog
          open={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ position: 'relative' }}>
              <IconButton
                onClick={() => setSelectedPost(null)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  zIndex: 1,
                }}
              >
                <Close />
              </IconButton>
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.caption}
                style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain' }}
              />
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default ExploreGrid;