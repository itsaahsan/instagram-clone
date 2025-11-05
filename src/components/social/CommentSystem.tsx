import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Avatar,
  Typography,
  Button,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Send,
  Close,
  FavoriteBorder,
  Favorite,
  Reply,
  MoreVert,
  Report,
  Block,
  Delete,
  EmojiEmotions,
  Tag,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Comment, User } from '@/types';
import { mockUsers } from '@/data/mockData';

interface CommentSystemProps {
  open: boolean;
  onClose: () => void;
  postId: string;
  comments: Comment[];
  onAddComment: (text: string, parentId?: string) => void;
  onLikeComment: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
}

interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string, username: string) => void;
  onLike: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  level?: number;
}

const EMOJI_LIST = ['❤️', '😍', '😂', '😮', '😢', '😡', '👍', '👏', '🔥', '💯'];

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onLike,
  onDelete,
  level = 0,
}) => {
  const { user } = useAuth();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [showReplies, setShowReplies] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const isOwnComment = user?.id === comment.userId;

  return (
    <Box sx={{ ml: level * 3 }}>
      <Box sx={{ display: 'flex', gap: 2, py: 1 }}>
        <Avatar
          src={comment.user.profilePicture}
          alt={comment.user.displayName}
          sx={{ width: 32, height: 32 }}
        >
          {comment.user.displayName?.charAt(0)}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="body2" fontWeight={600}>
                  {comment.user.displayName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                {comment.text}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Button
                  size="small"
                  startIcon={comment.isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
                  onClick={() => onLike(comment.id)}
                  sx={{
                    minWidth: 'auto',
                    p: 0.5,
                    color: comment.isLiked ? 'error.main' : 'text.secondary',
                  }}
                >
                  {comment.likesCount > 0 && comment.likesCount}
                </Button>

                <Button
                  size="small"
                  startIcon={<Reply />}
                  onClick={() => onReply(comment.id, comment.user.username)}
                  sx={{ minWidth: 'auto', p: 0.5, color: 'text.secondary' }}
                >
                  Reply
                </Button>

                {comment.repliesCount > 0 && (
                  <Button
                    size="small"
                    onClick={() => setShowReplies(!showReplies)}
                    sx={{ minWidth: 'auto', p: 0.5, color: 'text.secondary' }}
                  >
                    {showReplies ? 'Hide' : 'View'} {comment.repliesCount} replies
                  </Button>
                )}
              </Box>
            </Box>

            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVert fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        {isOwnComment ? (
          <MenuItem onClick={() => { onDelete(comment.id); handleMenuClose(); }}>
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        ) : (
          [
            <MenuItem key="report" onClick={handleMenuClose}>
              <ListItemIcon>
                <Report fontSize="small" />
              </ListItemIcon>
              <ListItemText>Report</ListItemText>
            </MenuItem>,
            <MenuItem key="block" onClick={handleMenuClose}>
              <ListItemIcon>
                <Block fontSize="small" />
              </ListItemIcon>
              <ListItemText>Block User</ListItemText>
            </MenuItem>
          ]
        )}
      </Menu>
    </Box>
  );
};

const CommentSystem: React.FC<CommentSystemProps> = ({
  open,
  onClose,
  postId,
  comments,
  onAddComment,
  onLikeComment,
  onDeleteComment,
}) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; username: string } | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mentionSuggestions, setMentionSuggestions] = useState<User[]>([]);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const textFieldRef = useRef<HTMLInputElement>(null);

  // Sort comments to show top-level first, then replies
  const sortedComments = comments
    .filter(comment => !comment.parentCommentId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    onAddComment(newComment, replyingTo?.id);
    setNewComment('');
    setReplyingTo(null);
  };

  const handleReply = (commentId: string, username: string) => {
    setReplyingTo({ id: commentId, username });
    setNewComment(`@${username} `);
    textFieldRef.current?.focus();
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewComment(prev => prev + emoji);
    setShowEmojiPicker(false);
    textFieldRef.current?.focus();
  };

  const handleTextChange = (value: string) => {
    setNewComment(value);

    // Check for @ mentions
    const mentionMatch = value.match(/@(\w*)$/);
    if (mentionMatch) {
      const query = mentionMatch[1].toLowerCase();
      setMentionQuery(query);
      
      const suggestions = mockUsers.filter(u => 
        u.username.toLowerCase().includes(query) ||
        u.displayName.toLowerCase().includes(query)
      ).slice(0, 5);
      
      setMentionSuggestions(suggestions);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const handleMentionSelect = (user: User) => {
    const beforeMention = newComment.replace(/@\w*$/, '');
    setNewComment(`${beforeMention}@${user.username} `);
    setShowMentions(false);
    textFieldRef.current?.focus();
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setNewComment('');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { height: '80vh', maxHeight: '600px' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">
          Comments ({comments.length})
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', p: 0 }}>
        {/* Comments List */}
        <Box sx={{ flex: 1, overflow: 'auto', px: 2 }}>
          {sortedComments.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                No comments yet. Be the first to comment!
              </Typography>
            </Box>
          ) : (
            sortedComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleReply}
                onLike={onLikeComment}
                onDelete={onDeleteComment}
              />
            ))
          )}
        </Box>

        <Divider />

        {/* Reply indicator */}
        {replyingTo && (
          <Box sx={{ px: 2, py: 1, bgcolor: 'action.hover' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                Replying to @{replyingTo.username}
              </Typography>
              <Button size="small" onClick={cancelReply}>
                Cancel
              </Button>
            </Box>
          </Box>
        )}

        {/* Mention Suggestions */}
        {showMentions && mentionSuggestions.length > 0 && (
          <Box sx={{ px: 2, py: 1, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {mentionSuggestions.map((user) => (
                <Chip
                  key={user.id}
                  avatar={<Avatar src={user.profilePicture} sx={{ width: 24, height: 24 }} />}
                  label={`@${user.username}`}
                  size="small"
                  onClick={() => handleMentionSelect(user)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <Box sx={{ px: 2, py: 1, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {EMOJI_LIST.map((emoji) => (
                <Button
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji)}
                  sx={{ minWidth: 40, height: 40, fontSize: '1.2em' }}
                >
                  {emoji}
                </Button>
              ))}
            </Box>
          </Box>
        )}

        {/* Comment Input */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <Avatar
              src={user?.profilePicture}
              alt={user?.displayName}
              sx={{ width: 32, height: 32 }}
            >
              {user?.displayName?.charAt(0)}
            </Avatar>

            <TextField
              ref={textFieldRef}
              fullWidth
              multiline
              maxRows={4}
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => handleTextChange(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <EmojiEmotions />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <IconButton
              color="primary"
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
            >
              <Send />
            </IconButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CommentSystem;