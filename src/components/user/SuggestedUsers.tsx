import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { User } from '@/types';
import { useNavigate } from 'react-router-dom';

interface SuggestedUsersProps {
  users: User[];
}

const SuggestedUsers: React.FC<SuggestedUsersProps> = ({ users }) => {
  const navigate = useNavigate();
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  const handleFollow = (userId: string) => {
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleUserClick = (username: string) => {
    navigate(`/${username}`);
  };

  if (users.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
            Suggestions for you
          </Typography>
          <Button
            variant="text"
            size="small"
            onClick={() => navigate('/explore/people')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            See All
          </Button>
        </Box>

        <List dense sx={{ p: 0 }}>
          {users.map((user) => (
            <ListItem key={user.id} sx={{ px: 0, py: 1 }}>
              <ListItemAvatar>
                <Avatar
                  src={user.profilePicture}
                  alt={user.displayName}
                  sx={{ width: 40, height: 40, cursor: 'pointer' }}
                  onClick={() => handleUserClick(user.username)}
                >
                  {user.displayName?.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleUserClick(user.username)}
                  >
                    {user.displayName}
                    {user.verified && (
                      <Box
                        component="span"
                        sx={{
                          ml: 0.5,
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: 'primary.main',
                          color: 'white',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '8px',
                          fontWeight: 'bold',
                        }}
                      >
                        ✓
                      </Box>
                    )}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    @{user.username}
                  </Typography>
                }
              />
              
              <ListItemSecondaryAction>
                <Button
                  variant={followedUsers.has(user.id) ? 'outlined' : 'contained'}
                  size="small"
                  onClick={() => handleFollow(user.id)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 70,
                    fontSize: '0.75rem',
                  }}
                >
                  {followedUsers.has(user.id) ? 'Following' : 'Follow'}
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default SuggestedUsers;