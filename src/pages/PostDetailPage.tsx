import React, { useState, useEffect } from 'react';
import { Box, Typography, Dialog, useMediaQuery, useTheme } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { mockPosts } from '@/data/mockData';
import { Post } from '@/types';
import PostDetailView from '@/components/post/PostDetailView';

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (postId) {
      const foundPost = mockPosts.find(p => p.id === postId);
      if (foundPost) {
        setPost(foundPost);
      } else {
        navigate('/');
      }
    }
  }, [postId, navigate]);

  const handleLike = () => {
    if (post) {
      setPost({
        ...post,
        isLiked: !post.isLiked,
        likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
      });
    }
  };

  const handleSave = () => {
    if (post) {
      setPost({
        ...post,
        isSaved: !post.isSaved,
      });
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  if (!post) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Loading post...</Typography>
      </Box>
    );
  }

  if (isMobile) {
    return (
      <Box sx={{ height: '100vh' }}>
        <PostDetailView
          post={post}
          onLike={handleLike}
          onSave={handleSave}
        />
      </Box>
    );
  }

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          m: 2,
        },
      }}
    >
      <PostDetailView
        post={post}
        onLike={handleLike}
        onSave={handleSave}
      />
    </Dialog>
  );
};

export default PostDetailPage;