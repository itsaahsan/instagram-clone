import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Button,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { mockNotifications } from '@/data/mockData';
import { Notification } from '@/types';
import { useNavigate } from 'react-router-dom';

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    setNotifications(mockNotifications);
  };

  const getNotificationText = (notification: Notification): string => {
    switch (notification.type) {
      case 'like':
        return 'liked your post';
      case 'comment':
        return 'commented on your post';
      case 'follow':
        return 'started following you';
      case 'mention':
        return 'mentioned you in a comment';
      default:
        return '';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.postId) {
      navigate(`/p/${notification.postId}`);
    } else if (notification.type === 'follow') {
      navigate(`/${notification.fromUser.username}`);
    }
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const allNotifications = notifications;

  const renderNotifications = (notificationList: Notification[]) => (
    <List>
      {notificationList.map((notification) => (
        <ListItem
          key={notification.id}
          sx={{
            cursor: 'pointer',
            backgroundColor: notification.isRead ? 'transparent' : 'action.hover',
            '&:hover': {
              backgroundColor: 'action.selected',
            },
          }}
          onClick={() => handleNotificationClick(notification)}
        >
          <ListItemAvatar>
            <Avatar
              src={notification.fromUser.profilePicture}
              alt={notification.fromUser.displayName}
            >
              {notification.fromUser.displayName?.charAt(0)}
            </Avatar>
          </ListItemAvatar>
          
          <ListItemText
            primary={
              <Typography variant="body2">
                <strong>{notification.fromUser.displayName}</strong>{' '}
                {getNotificationText(notification)}
                {notification.text && (
                  <Box component="span" sx={{ color: 'text.secondary', ml: 1 }}>
                    "{notification.text}"
                  </Box>
                )}
              </Typography>
            }
            secondary={formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          />
          
          {notification.type === 'follow' && (
            <Button variant="outlined" size="small">
              Follow Back
            </Button>
          )}
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
        Notifications
      </Typography>

      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab
          label={
            <Badge badgeContent={unreadNotifications.length} color="error">
              New
            </Badge>
          }
        />
        <Tab label="All" />
      </Tabs>

      {tabValue === 0 && (
        unreadNotifications.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              You're all caught up!
            </Typography>
            <Typography color="text.secondary">
              Check back later for new notifications.
            </Typography>
          </Box>
        ) : (
          renderNotifications(unreadNotifications)
        )
      )}

      {tabValue === 1 && (
        allNotifications.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No notifications yet
            </Typography>
            <Typography color="text.secondary">
              When someone likes or comments on your posts, you'll see it here.
            </Typography>
          </Box>
        ) : (
          renderNotifications(allNotifications)
        )
      )}
    </Box>
  );
};

export default NotificationsPage;