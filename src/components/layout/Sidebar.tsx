import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Typography,
  Badge,
} from '@mui/material';
import {
  Home,
  Search,
  Explore,
  OndemandVideo,
  ChatBubbleOutline,
  FavoriteBorder,
  AddBox,
  Person,
  Menu as MenuIcon,
  Videocam,
  ShoppingBag,
  Analytics,
  MonetizationOn,
  Psychology,
  Star,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  mobile?: boolean;
  open?: boolean;
  onClose?: () => void;
}

const DRAWER_WIDTH = 240;

const navigationItems = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Search', icon: Search, path: '/explore' },
  { label: 'Explore', icon: Explore, path: '/explore' },
  { label: 'Reels', icon: OndemandVideo, path: '/reels' },
  { label: 'Messages', icon: ChatBubbleOutline, path: '/messages', badge: 2 },
  { label: 'Notifications', icon: FavoriteBorder, path: '/notifications', badge: 3 },
  { label: 'Create', icon: AddBox, path: '/create' },
  { label: 'Live', icon: Videocam, path: '/live' },
  { label: 'Shopping', icon: ShoppingBag, path: '/shopping' },
  { label: 'Profile', icon: Person, path: '/profile' },
];

const creatorItems = [
  { label: 'Creator Studio', icon: MonetizationOn, path: '/creator-studio' },
  { label: 'Analytics', icon: Analytics, path: '/analytics' },
  { label: 'AI Features', icon: Psychology, path: '/ai-features' },
];

const Sidebar: React.FC<SidebarProps> = ({ mobile = false, open = false, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (mobile && onClose) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo/Brand */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            fontFamily: 'cursive',
            background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            cursor: 'pointer',
          }}
          onClick={() => handleNavigation('/')}
        >
          Instagram
        </Typography>
      </Box>

      {/* Navigation Items */}
      <List sx={{ flex: 1, py: 1 }}>
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;

          return (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  backgroundColor: isActive ? 'action.selected' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error">
                      <IconComponent
                        sx={{
                          fontSize: 24,
                          color: isActive ? 'primary.main' : 'text.primary',
                        }}
                      />
                    </Badge>
                  ) : (
                    <IconComponent
                      sx={{
                        fontSize: 24,
                        color: isActive ? 'primary.main' : 'text.primary',
                      }}
                    />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'primary.main' : 'text.primary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User Profile Section */}
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleNavigation('/profile')}
            sx={{
              mx: 1,
              my: 1,
              borderRadius: 2,
              backgroundColor: location.pathname === '/profile' ? 'action.selected' : 'transparent',
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Avatar
                src={user?.profilePicture}
                alt={user?.displayName}
                sx={{ width: 24, height: 24 }}
              >
                {user?.displayName?.charAt(0)}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={user?.displayName}
              secondary={`@${user?.username}`}
              primaryTypographyProps={{
                fontWeight: 500,
                fontSize: 14,
              }}
              secondaryTypographyProps={{
                fontSize: 12,
              }}
            />
          </ListItemButton>
        </ListItem>

        {/* More Menu */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleNavigation('/settings')}
            sx={{ mx: 1, mb: 1, borderRadius: 2 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <MenuIcon sx={{ fontSize: 24 }} />
            </ListItemIcon>
            <ListItemText
              primary="More"
              primaryTypographyProps={{
                fontWeight: 400,
              }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  if (mobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;