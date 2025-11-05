import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Add,
  MusicNote,
  Favorite,
  FavoriteBorder,
  Comment,
  MoreVert,
  Send,
  Close,
} from '@mui/icons-material';
import { Note, NoteReply, MusicTrack } from '@/types';

interface NotesProps {
  userId: string;
}

const Notes: React.FC<NotesProps> = ({ userId }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRepliesDialog, setShowRepliesDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedMusic, setSelectedMusic] = useState<MusicTrack | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  // Mock notes data
  const mockNotes: Note[] = [
    {
      id: '1',
      userId: 'user1',
      user: {
        id: 'user1',
        username: 'alice_wonder',
        email: 'alice@example.com',
        displayName: 'Alice Wonder',
        profilePicture: '/images/avatar1.jpg',
        verified: true,
        private: false,
        followersCount: 1200,
        followingCount: 450,
        postsCount: 89,
        createdAt: new Date(),
        accountType: 'creator',
        twoFactorEnabled: false,
        closeFriends: [],
        restrictedUsers: [],
        mutedUsers: [],
        blockedUsers: [],
      },
      content: 'Just had the best coffee ever! ☕️',
      likesCount: 24,
      repliesCount: 3,
      isLiked: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 hours from now
    },
    {
      id: '2',
      userId: 'user2',
      user: {
        id: 'user2',
        username: 'bob_creator',
        email: 'bob@example.com',
        displayName: 'Bob Creator',
        profilePicture: '/images/avatar2.jpg',
        verified: false,
        private: false,
        followersCount: 850,
        followingCount: 320,
        postsCount: 156,
        createdAt: new Date(),
        accountType: 'personal',
        twoFactorEnabled: true,
        closeFriends: [],
        restrictedUsers: [],
        mutedUsers: [],
        blockedUsers: [],
      },
      content: 'Working on something exciting 🚀',
      musicTrack: {
        id: 'music1',
        title: 'Lo-Fi Beats',
        artist: 'Chill Music',
        url: '/audio/lofi.mp3',
        duration: 120,
        isOriginal: false,
        usageCount: 5000,
        trending: true,
      },
      likesCount: 67,
      repliesCount: 8,
      isLiked: true,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000), // 20 hours from now
    },
  ];

  const prompts = [
    'What\'s on your mind?',
    'Share your current mood',
    'What are you grateful for today?',
    'Drop your favorite emoji',
    'What\'s your goal for today?',
  ];

  const musicTracks: MusicTrack[] = [
    {
      id: 'music1',
      title: 'Chill Vibes',
      artist: 'Relaxing Sounds',
      url: '/audio/chill.mp3',
      duration: 60,
      isOriginal: false,
      usageCount: 1200,
      trending: true,
    },
    {
      id: 'music2',
      title: 'Morning Energy',
      artist: 'Upbeat Music',
      url: '/audio/energy.mp3',
      duration: 45,
      isOriginal: false,
      usageCount: 800,
      trending: false,
    },
  ];

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      userId,
      user: mockNotes[0].user, // Would be current user
      content: newNoteContent,
      musicTrack: selectedMusic || undefined,
      prompt: selectedPrompt || undefined,
      likesCount: 0,
      repliesCount: 0,
      isLiked: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    };

    setNotes([newNote, ...notes]);
    setNewNoteContent('');
    setSelectedMusic(null);
    setSelectedPrompt('');
    setShowCreateDialog(false);
  };

  const handleLikeNote = (noteId: string) => {
    setNotes(notes.map(note => 
      note.id === noteId 
        ? { 
            ...note, 
            isLiked: !note.isLiked,
            likesCount: note.isLiked ? note.likesCount - 1 : note.likesCount + 1
          }
        : note
    ));
  };

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const remaining = expiresAt.getTime() - now.getTime();
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    return `${hours}h`;
  };

  const NoteCard: React.FC<{ note: Note }> = ({ note }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar
            src={note.user.profilePicture}
            alt={note.user.displayName}
            sx={{ width: 40, height: 40 }}
          />
          
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {note.user.displayName}
                </Typography>
                <Chip
                  label={getTimeRemaining(note.expiresAt)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
              <IconButton
                size="small"
                onClick={(e) => setMenuAnchor(e.currentTarget)}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>

            {note.prompt && (
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                {note.prompt}
              </Typography>
            )}

            <Typography variant="body1" sx={{ mb: 1 }}>
              {note.content}
            </Typography>

            {note.musicTrack && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <MusicNote fontSize="small" color="primary" />
                <Typography variant="caption" color="primary">
                  {note.musicTrack.title} • {note.musicTrack.artist}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={() => handleLikeNote(note.id)}
                  color={note.isLiked ? 'error' : 'default'}
                >
                  {note.isLiked ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                </IconButton>
                <Typography variant="caption">
                  {note.likesCount}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={() => {
                    setSelectedNote(note);
                    setShowRepliesDialog(true);
                  }}
                >
                  <Comment fontSize="small" />
                </IconButton>
                <Typography variant="caption">
                  {note.repliesCount}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Notes
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowCreateDialog(true)}
        >
          Add Note
        </Button>
      </Box>

      {/* Notes List */}
      <Box>
        {[...mockNotes, ...notes].map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </Box>

      {/* Create Note Dialog */}
      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create a Note</DialogTitle>
        <DialogContent>
          {/* Prompt Selection */}
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Choose a prompt (optional):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {prompts.map((prompt) => (
              <Chip
                key={prompt}
                label={prompt}
                onClick={() => setSelectedPrompt(prompt)}
                color={selectedPrompt === prompt ? 'primary' : 'default'}
                variant={selectedPrompt === prompt ? 'filled' : 'outlined'}
                size="small"
              />
            ))}
          </Box>

          {/* Content Input */}
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="What's on your mind?"
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 60 }}
            helperText={`${newNoteContent.length}/60 characters`}
          />

          {/* Music Selection */}
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Add music (optional):
          </Typography>
          <List dense>
            {musicTracks.map((track) => (
              <ListItem
                key={track.id}
                button
                onClick={() => setSelectedMusic(track)}
                selected={selectedMusic?.id === track.id}
              >
                <ListItemAvatar>
                  <Avatar>
                    <MusicNote />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={track.title}
                  secondary={track.artist}
                />
                {track.trending && (
                  <Chip label="Trending" size="small" color="primary" />
                )}
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateNote}
            variant="contained"
            disabled={!newNoteContent.trim()}
          >
            Share Note
          </Button>
        </DialogActions>
      </Dialog>

      {/* Replies Dialog */}
      <Dialog
        open={showRepliesDialog}
        onClose={() => setShowRepliesDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedNote && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Replies</Typography>
                <IconButton onClick={() => setShowRepliesDialog(false)}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              {/* Original Note */}
              <NoteCard note={selectedNote} />
              
              {/* Reply Input */}
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Reply to this note..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  size="small"
                />
                <IconButton
                  color="primary"
                  disabled={!replyContent.trim()}
                  onClick={() => {
                    // Handle reply submission
                    setReplyContent('');
                  }}
                >
                  <Send />
                </IconButton>
              </Box>

              {/* Replies would be displayed here */}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                No replies yet. Be the first to reply!
              </Typography>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => setMenuAnchor(null)}>
          Report
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          Hide
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Notes;