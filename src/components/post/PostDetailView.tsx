import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
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
  EmojiEmotions,
  Reply,
  ThumbUp,
  ThumbUpOutlined,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Post, Comment } from '@/types';
import { mockComments, mockUsers } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

interface PostDetailViewProps {
  post: Post;
  onLike: () => void;
  onSave: () => void;
}

interface ExtendedComment extends Comment {
  replies?: ExtendedComment[];
  isLiked: boolean;
  showReplies?: boolean;
}

const PostDetailView: React.FC<PostDetailViewProps> = ({
  post,
  onLike,
  onSave,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [comments, setComments] = useState<ExtendedComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<ExtendedComment | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedComment, setSelectedComment] = useState<ExtendedComment | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);

  useEffect(() => {
    loadComments();
  }, [post.id]);

  const loadComments = () => {
    // Generate mock comments with replies
    const baseComments = mockComments.filter(c => c.postId === post.id);
    const extendedComments: ExtendedComment[] = baseComments.map(comment => ({
      ...comment,
      isLiked: Math.random() > 0.7,
      showReplies: false,
      replies: Math.random() > 0.6 ? [
        {
          id: `${comment.id}_reply_1`,
          postId: post.id,
          userId: mockUsers[Math.floor(Math.random() * mockUsers.length)].id,
          user: mockUsers[Math.floor(Math.random() * mockUsers.length)],
          text: 'Thanks for sharing! 😊',
          mentionedUsers: [comment.userId],
          likesCount: Math.floor(Math.random() * 20),
          isLiked: Math.random() > 0.8,
          parentCommentId: comment.id,
          repliesCount: 0,
          createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        }
      ] : [],
    }));

    setComments(extendedComments);
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;

    const comment: ExtendedComment = {
      id: Date.now().toString(),
      postId: post.id,
      userId: user.id,
      user: user,
      text: newComment.trim(),
      mentionedUsers: [],
      likesCount: 0,
      isLiked: false,
      parentCommentId: replyingTo?.id,
      repliesCount: 0,
      showReplies: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (replyingTo) {
      // Add as reply
      setComments(prev => prev.map(c => 
        c.id === replyingTo.id 
          ? { 
              ...c, 
              replies: [...(c.replies || []), comment],
              repliesCount: (c.replies?.length || 0) + 1,
              showReplies: true,
            }
          : c
      ));
      setReplyingTo(null);
    } else {
      // Add as new comment
      setComments(prev => [comment, ...prev]);
    }

    setNewComment('');
  };

  const handleCommentLike = (commentId: string, isReply: boolean = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(prev => prev.map(comment => 
        comment.id === parentId
          ? {
              ...comment,
              replies: comment.replies?.map(reply =>
                reply.id === commentId
                  ? {
                      ...reply,
                      isLiked: !reply.isLiked,
                      likesCount: reply.isLiked ? reply.likesCount - 1 : reply.likesCount + 1,
                    }
                  : reply
              )
            }
          : comment
      ));
    } else {
      setComments(prev => prev.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likesCount: comment.isLiked ? comment.likesCount - 1 : comment.likesCount + 1,
            }
          : comment
      ));
    }
  };

  const toggleReplies = (commentId: string) => {
    setComments(prev => prev.map(comment =>
      comment.id === commentId
        ? { ...comment, showReplies: !comment.showReplies }
        : comment
    ));
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const shareToApp = () => {
    const shareUrl = `${window.location.origin}/p/${post.id}`;
    
    // In a real app, you would integrate with actual sharing APIs
    navigator.clipboard.writeText(shareUrl);
    setShowShareDialog(false);
    // toast.success(`Link copied to clipboard!`);
  };

  const renderComment = (comment: ExtendedComment, isReply: boolean = false, parentId?: string) => (
    <Box key={comment.id}>
      <ListItem
        alignItems="flex-start"
        sx={{
          px: isReply ? 4 : 2,
          py: 1,
          backgroundColor: isReply ? 'action.hover' : 'transparent',
        }}
      >
        <ListItemAvatar>
          <Avatar
            src={comment.user.profilePicture}
            alt={comment.user.displayName}
            sx={{ width: isReply ? 24 : 32, height: isReply ? 24 : 32, cursor: 'pointer' }}
            onClick={() => navigate(`/${comment.user.username}`)}
          >
            {comment.user.displayName?.charAt(0)}
          </Avatar>
        </ListItemAvatar>
        
        <ListItemText
          primary={
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/${comment.user.username}`)}
                >
                  {comment.user.displayName}
                </Typography>
                {comment.user.verified && (
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '8px',
                      fontWeight: 'bold',
                    }}
                  >
                    ✓
                  </Box>
                )}
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                {comment.mentionedUsers.length > 0 && (
                  <Typography component="span" color="primary" fontWeight={600}>
                    @{comment.user.displayName}{' '}
                  </Typography>
                )}
                {comment.text}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  size="small"
                  startIcon={
                    comment.isLiked ? (
                      <ThumbUp sx={{ fontSize: 14, color: 'primary.main' }} />
                    ) : (
                      <ThumbUpOutlined sx={{ fontSize: 14 }} />
                    )
                  }
                  onClick={() => handleCommentLike(comment.id, isReply, parentId)}
                  sx={{ 
                    minWidth: 'auto', 
                    p: 0.5,
                    color: comment.isLiked ? 'primary.main' : 'text.secondary',
                  }}
                >
                  {comment.likesCount > 0 && comment.likesCount}
                </Button>
                
                {!isReply && (
                  <Button
                    size="small"
                    startIcon={<Reply sx={{ fontSize: 14 }} />}
                    onClick={() => setReplyingTo(comment)}
                    sx={{ minWidth: 'auto', p: 0.5, color: 'text.secondary' }}
                  >
                    Reply
                  </Button>
                )}
                
                <IconButton
                  size="small"
                  onClick={(e) => {
                    setSelectedComment(comment);
                    setMenuAnchor(e.currentTarget);
                  }}
                >
                  <MoreVert sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
              
              {!isReply && comment.replies && comment.replies.length > 0 && (
                <Button
                  size="small"
                  onClick={() => toggleReplies(comment.id)}
                  sx={{ mt: 1, textTransform: 'none', color: 'text.secondary' }}
                >
                  {comment.showReplies ? 'Hide' : 'View'} {comment.replies.length} replies
                </Button>
              )}
            </Box>
          }
        />
      </ListItem>
      
      {!isReply && comment.showReplies && comment.replies && (
        <Box>
          {comment.replies.map(reply => renderComment(reply, true, comment.id))}
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
      {/* Image Section */}
      <Box
        sx={{
          flex: isMobile ? '0 0 auto' : 1,
          backgroundColor: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: isMobile ? 400 : 'auto',
        }}
      >
        <img
          src={post.imageUrl}
          alt={post.caption}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          flex: isMobile ? 1 : '0 0 400px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.paper',
        }}
      >
        {/* Post Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={post.user.profilePicture}
              alt={post.user.displayName}
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate(`/${post.user.username}`)}
            >
              {post.user.displayName?.charAt(0)}
            </Avatar>
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`/${post.user.username}`)}
              >
                {post.user.displayName}
                {post.user.verified && (
                  <Box
                    component="span"
                    sx={{
                      ml: 0.5,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      color: 'white',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 'bold',
                    }}
                  >
                    ✓
                  </Box>
                )}
              </Typography>
              {post.location && (
                <Typography variant="caption" color="text.secondary">
                  📍 {typeof post.location === 'string' ? post.location : post.location?.name}
                </Typography>
              )}
            </Box>
          </Box>
          <IconButton>
            <MoreVert />
          </IconButton>
        </Box>

        {/* Comments Section */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {/* Original Post Caption as First Comment */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Avatar
                src={post.user.profilePicture}
                alt={post.user.displayName}
                sx={{ width: 32, height: 32 }}
              >
                {post.user.displayName?.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">
                  <Typography component="span" fontWeight={600}>
                    {post.user.displayName}
                  </Typography>{' '}
                  {post.caption}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </Typography>
                
                {post.tags.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    {post.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={`#${tag}`}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5, fontSize: '0.75rem', cursor: 'pointer' }}
                        onClick={() => navigate(`/explore?tag=${tag}`)}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Comments List */}
          <List sx={{ py: 0 }}>
            {comments.map(comment => renderComment(comment))}
          </List>

          {comments.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                No comments yet. Be the first to comment!
              </Typography>
            </Box>
          )}
        </Box>

        {/* Post Actions */}
        <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={onLike}>
                {post.isLiked ? (
                  <Favorite sx={{ color: 'red', fontSize: 28 }} />
                ) : (
                  <FavoriteBorder sx={{ fontSize: 28 }} />
                )}
              </IconButton>
              <IconButton>
                <ChatBubbleOutline sx={{ fontSize: 28 }} />
              </IconButton>
              <IconButton onClick={handleShare}>
                <Share sx={{ fontSize: 28 }} />
              </IconButton>
            </Box>
            <IconButton onClick={onSave}>
              {post.isSaved ? (
                <Bookmark sx={{ fontSize: 28 }} />
              ) : (
                <BookmarkBorder sx={{ fontSize: 28 }} />
              )}
            </IconButton>
          </Box>

          {/* Likes Count */}
          {post.likesCount > 0 && (
            <Box sx={{ px: 2, pb: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {post.likesCount.toLocaleString()} {post.likesCount === 1 ? 'like' : 'likes'}
              </Typography>
            </Box>
          )}

          {/* Reply Preview */}
          {replyingTo && (
            <Box sx={{ px: 2, py: 1, backgroundColor: 'action.hover' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="primary">
                  Replying to {replyingTo.user.displayName}
                </Typography>
                <IconButton size="small" onClick={() => setReplyingTo(null)}>
                  ✕
                </IconButton>
              </Box>
            </Box>
          )}

          {/* Comment Input */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, borderTop: 1, borderColor: 'divider' }}>
            <IconButton size="small">
              <EmojiEmotions />
            </IconButton>
            <TextField
              fullWidth
              placeholder={replyingTo ? `Reply to ${replyingTo.user.displayName}...` : 'Add a comment...'}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              variant="standard"
              InputProps={{ disableUnderline: true }}
              sx={{ '& .MuiInputBase-input': { fontSize: 14 } }}
            />
            <IconButton
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              color="primary"
            >
              <Send />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Comment Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => {
          setMenuAnchor(null);
          setSelectedComment(null);
        }}
      >
        <MenuItem>Report</MenuItem>
        {selectedComment?.userId === user?.id && (
          <>
            <MenuItem>Edit</MenuItem>
            <MenuItem sx={{ color: 'error.main' }}>Delete</MenuItem>
          </>
        )}
        <MenuItem>Copy link</MenuItem>
      </Menu>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onClose={() => setShowShareDialog(false)}>
        <DialogTitle>Share this post</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={shareToApp}
              startIcon={<Share />}
            >
              Share to Twitter
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={shareToApp}
              startIcon={<Share />}
            >
              Share to Facebook
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={shareToApp}
              startIcon={<Share />}
            >
              Copy Link
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowShareDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostDetailView;