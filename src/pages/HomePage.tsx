import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { mockPosts, mockStories, mockUsers } from '@/data/mockData';
import { Post, Story, User } from '@/types';
import PostCard from '@/components/post/PostCard';
import StoryList from '@/components/story/StoryList';
import SuggestedUsers from '@/components/user/SuggestedUsers';
import { useAuth } from '@/contexts/AuthContext';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedData();
  }, []);

  const loadFeedData = async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Load posts (sorted by creation date)
      const sortedPosts = [...mockPosts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(sortedPosts);

      // Load stories (filter out expired ones)
      const validStories = mockStories.filter(
        story => new Date(story.expiresAt) > new Date()
      );
      setStories(validStories);

      // Load suggested users (exclude current user)
      const suggested = mockUsers
        .filter(u => u.id !== user?.id)
        .slice(0, 5);
      setSuggestedUsers(suggested);
    } catch (error) {
      // Error loading feed data - would handle with proper error state
    } finally {
      setLoading(false);
    }
  };

  const handlePostLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likesCount: post.isLiked
                ? post.likesCount - 1
                : post.likesCount + 1,
            }
          : post
      )
    );
  };

  const handlePostSave = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, isSaved: !post.isSaved }
          : post
      )
    );
  };

  const handlePostComment = (postId: string, text: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              commentsCount: post.commentsCount + 1,
            }
          : post
      )
    );
  };

  const handlePostShare = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              sharesCount: post.sharesCount + 1,
            }
          : post
      )
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography>Loading your feed...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Grid container spacing={3}>
        {/* Main Feed */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 3 }}>
            {/* Stories */}
            <StoryList stories={stories} />
          </Box>

          {/* Posts */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {posts.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Welcome to Instagram!
                  </Typography>
                  <Typography color="text.secondary">
                    When you follow people, you'll see the photos and videos they post here.
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handlePostLike}
                  onSave={handlePostSave}
                  onComment={handlePostComment}
                  onShare={handlePostShare}
                />
              ))
            )}
          </Box>
        </Grid>

        {/* Sidebar */}
        {!isMobile && (
          <Grid item md={4}>
            <Box sx={{ position: 'sticky', top: 80 }}>
              {/* Current User Info */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={user?.profilePicture}
                      alt={user?.displayName}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    >
                      {user?.displayName?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {user?.displayName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        @{user?.username}
                      </Typography>
                    </Box>
                  </Box>
                  {user?.bio && (
                    <Typography variant="body2" color="text.secondary">
                      {user.bio}
                    </Typography>
                  )}
                </CardContent>
              </Card>

              {/* Suggested Users */}
              <SuggestedUsers users={suggestedUsers} />

              {/* Footer */}
              <Box sx={{ mt: 3, px: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  © 2024 Instagram Clone
                </Typography>
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default HomePage;