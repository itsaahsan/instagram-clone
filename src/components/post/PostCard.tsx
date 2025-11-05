import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Share,
  Bookmark,
  BookmarkBorder,
  MoreVert,
  Send,
  Close,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { Post, Comment } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onShare: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onSave, onComment, onShare }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [postLikes, setPostLikes] = useState(post.likesCount);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserClick = () => {
    navigate(`/${post.user.username}`);
  };

  const handlePostClick = () => {
    navigate(`/p/${post.id}`);
  };

  const handleLike = () => {
    const newLikeStatus = !isLiked;
    setIsLiked(newLikeStatus);
    setPostLikes(prev => newLikeStatus ? prev + 1 : prev - 1);
    onLike(post.id);
    toast.success(newLikeStatus ? 'Post liked!' : 'Post unliked');
  };

  const handleSave = () => {
    const newSaveStatus = !isSaved;
    setIsSaved(newSaveStatus);
    onSave(post.id);
    toast.success(newSaveStatus ? 'Post saved!' : 'Post unsaved');
  };

  const handleShare = () => {
    onShare(post.id);
    toast.success('Post shared!');
  };

  const handleComment = () => {
    setShowCommentDialog(true);
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    onComment(post.id, commentText);
    setCommentText('');
    setShowCommentDialog(false);
    toast.success('Comment posted!');
  };

  const formatTimeAgo = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const truncateCaption = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const renderCaption = () => {
    if (!post.caption) return null;

    const shouldTruncate = post.caption.length > 100;
    const displayText = showFullCaption ? post.caption : truncateCaption(post.caption);

    return (
      <Typography variant="body2" component="div">
        <Box component="span" sx={{ fontWeight: 600, mr: 1 }}>
          {post.user.displayName}
        </Box>
        {displayText}
        {shouldTruncate && (
          <Button
            size="small"
            onClick={() => setShowFullCaption(!showFullCaption)}
            sx={{ p: 0, minWidth: 'auto', ml: 1, textTransform: 'none' }}
          >
            {showFullCaption ? 'less' : 'more'}
          </Button>
        )}
        {post.tags.length > 0 && (
          <Box sx={{ mt: 1 }}>
            {post.tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                size="small"
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5, fontSize: '0.75rem' }}
                onClick={() => navigate(`/explore?tag=${tag}`)}
              />
            ))}
          </Box>
        )}
      </Typography>
    );
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mb: 2 }}>
      {/* Header */}
      <CardHeader
        avatar={
          <Avatar
            src={post.user.profilePicture}
            alt={post.user.displayName}
            sx={{ cursor: 'pointer' }}
            onClick={handleUserClick}
          >
            {post.user.displayName?.charAt(0)}
          </Avatar>
        }
        action={
          <IconButton onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
        }
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, cursor: 'pointer' }}
              onClick={handleUserClick}
            >
              {post.user.displayName}
            </Typography>
            {post.user.verified && (
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
        subheader={
          <Box>
            <Typography variant="caption" color="text.secondary">
              {formatTimeAgo(post.createdAt)}
            </Typography>
            {post.location && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                📍 {typeof post.location === 'string' ? post.location : post.location?.name}
              </Typography>
            )}
          </Box>
        }
        sx={{ pb: 1 }}
      />

      {/* Image/Video */}
      <Box sx={{ position: 'relative', width: '100%', backgroundColor: '#000' }}>
        {post.isCarousel && post.imageUrls ? (
          // Carousel Post
          <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1' }}>
            <img
              src={post.imageUrls[0]}
              alt={post.caption}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: 'pointer',
              }}
              onLoad={() => setImageLoaded(true)}
              onClick={handlePostClick}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '12px',
              }}
            >
              1 / {post.imageUrls.length}
            </Box>
          </Box>
        ) : post.videoUrl ? (
          // Video Post
          <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1' }}>
            <video
              src={post.videoUrl}
              poster={post.imageUrl}
              controls={false}
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: 'pointer',
              }}
              onClick={handlePostClick}
              onLoadedData={() => setImageLoaded(true)}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Box component="span" sx={{ fontSize: '14px' }}>▶</Box>
              {post.videoDuration}s
            </Box>
          </Box>
        ) : (
          // Image Post
          <img
            src={post.imageUrl}
            alt={post.caption}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '600px',
              objectFit: 'cover',
              cursor: 'pointer',
              display: imageLoaded ? 'block' : 'none',
            }}
            onLoad={() => setImageLoaded(true)}
            onClick={handlePostClick}
          />
        )}
        
        {!imageLoaded && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'grey.200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              aspectRatio: '1',
            }}
          >
            <Typography color="text.secondary">Loading...</Typography>
          </Box>
        )}
      </Box>

      {/* Actions */}
      <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
        <Box>
          <IconButton onClick={handleLike} sx={{ p: 1 }}>
            {isLiked ? (
              <Favorite sx={{ color: 'red', fontSize: 28 }} />
            ) : (
              <FavoriteBorder sx={{ fontSize: 28 }} />
            )}
          </IconButton>
          <IconButton onClick={handleComment} sx={{ p: 1 }}>
            <ChatBubbleOutline sx={{ fontSize: 28 }} />
          </IconButton>
          <IconButton onClick={handleShare} sx={{ p: 1 }}>
            <Share sx={{ fontSize: 28 }} />
          </IconButton>
        </Box>
        <IconButton onClick={handleSave} sx={{ p: 1 }}>
          {isSaved ? (
            <Bookmark sx={{ fontSize: 28 }} />
          ) : (
            <BookmarkBorder sx={{ fontSize: 28 }} />
          )}
        </IconButton>
      </CardActions>

      {/* Content */}
      <CardContent sx={{ pt: 0 }}>
        {/* Likes */}
        {postLikes > 0 && (
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            {postLikes.toLocaleString()} {postLikes === 1 ? 'like' : 'likes'}
          </Typography>
        )}

        {/* Caption */}
        {renderCaption()}

        {/* Comments */}
        {post.commentsCount > 0 && (
          <Button
            variant="text"
            size="small"
            onClick={handlePostClick}
            sx={{
              p: 0,
              mt: 1,
              textTransform: 'none',
              color: 'text.secondary',
              justifyContent: 'flex-start',
            }}
          >
            View all {post.commentsCount} comments
          </Button>
        )}
      </CardContent>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Report</MenuItem>
        <MenuItem onClick={handleMenuClose}>Unfollow</MenuItem>
        <MenuItem onClick={handleMenuClose}>Copy link</MenuItem>
        <MenuItem onClick={() => { handleShare(); handleMenuClose(); }}>Share to...</MenuItem>
      </Menu>

      {/* Comment Dialog */}
      <Dialog open={showCommentDialog} onClose={() => setShowCommentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Comments</Typography>
            <IconButton onClick={() => setShowCommentDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Be the first to comment...
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Box sx={{ display: 'flex', gap: 1, width: '100%', alignItems: 'center' }}>
            <Avatar
              src={user?.profilePicture}
              sx={{ width: 32, height: 32 }}
            >
              {user?.displayName?.charAt(0)}
            </Avatar>
            <TextField
              fullWidth
              size="small"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
            />
            <IconButton
              color="primary"
              onClick={handleCommentSubmit}
              disabled={!commentText.trim()}
            >
              <Send />
            </IconButton>
          </Box>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PostCard;