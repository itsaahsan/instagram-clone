import React from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
  Avatar,
} from '@mui/material';
import {
  Home,
  Search,
  FavoriteBorder,
  OndemandVideo,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const MobileNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const getActiveIndex = () => {
    switch (location.pathname) {
      case '/':
        return 0;
      case '/explore':
        return 1;
      case '/reels':
        return 2;
      case '/notifications':
        return 3;
      case '/profile':
        return 4;
      default:
        return 0;
    }
  };

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/explore');
        break;
      case 2:
        navigate('/reels');
        break;
      case 3:
        navigate('/notifications');
        break;
      case 4:
        navigate('/profile');
        break;
    }
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
      elevation={3}
    >
      <BottomNavigation
        value={getActiveIndex()}
        onChange={handleChange}
        showLabels={false}
        sx={{
          height: 60,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            paddingTop: 1,
          },
        }}
      >
        <BottomNavigationAction
          icon={<Home sx={{ fontSize: 28 }} />}
          sx={{
            color: getActiveIndex() === 0 ? 'primary.main' : 'text.secondary',
          }}
        />
        
        <BottomNavigationAction
          icon={<Search sx={{ fontSize: 28 }} />}
          sx={{
            color: getActiveIndex() === 1 ? 'primary.main' : 'text.secondary',
          }}
        />
        
        <BottomNavigationAction
          icon={<OndemandVideo sx={{ fontSize: 28 }} />}
          sx={{
            color: getActiveIndex() === 2 ? 'primary.main' : 'text.secondary',
          }}
        />
        
        <BottomNavigationAction
          icon={
            <Badge badgeContent={3} color="error">
              <FavoriteBorder sx={{ fontSize: 28 }} />
            </Badge>
          }
          sx={{
            color: getActiveIndex() === 3 ? 'primary.main' : 'text.secondary',
          }}
        />
        
        <BottomNavigationAction
          icon={
            <Avatar
              src={user?.profilePicture}
              alt={user?.displayName}
              sx={{
                width: 28,
                height: 28,
                border: getActiveIndex() === 4 ? 2 : 0,
                borderColor: 'primary.main',
              }}
            >
              {user?.displayName?.charAt(0)}
            </Avatar>
          }
        />
      </BottomNavigation>
    </Paper>
  );
};

export default MobileNavigation;