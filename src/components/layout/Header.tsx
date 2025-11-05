import React, { useState } from 'react';
import {
  Toolbar,
  Typography,
  Box,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  FavoriteBorder,
  ChatBubbleOutline,
  Settings,
  Logout,
  Person,
  Bookmark,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
  showMenuButton: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, showMenuButton }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchValue, setSearchValue] = useState('');

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    await logout();
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchValue.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
    }
  };

  return (
    <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
      {/* Left Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {showMenuButton && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 'bold',
            cursor: 'pointer',
            fontFamily: 'cursive',
            background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: { xs: 'none', sm: 'block' },
          }}
          onClick={() => navigate('/')}
        >
          Instagram
        </Typography>
      </Box>

      {/* Center Section - Search */}
      {!isMobile && (
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            position: 'relative',
            backgroundColor: 'rgba(0,0,0,0.04)',
            borderRadius: 1,
            width: '100%',
            maxWidth: 300,
            mx: 2,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1,
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          </Box>
          <InputBase
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{
              width: '100%',
              px: 2,
              py: 1,
              pl: 5,
              fontSize: 14,
              '& input': {
                padding: 0,
              },
            }}
          />
        </Box>
      )}

      {/* Right Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {isMobile && (
          <IconButton onClick={() => navigate('/explore')}>
            <SearchIcon />
          </IconButton>
        )}
        
        <IconButton onClick={() => navigate('/notifications')}>
          <Badge badgeContent={3} color="error">
            <FavoriteBorder />
          </Badge>
        </IconButton>

        <IconButton onClick={() => navigate('/messages')}>
          <Badge badgeContent={2} color="error">
            <ChatBubbleOutline />
          </Badge>
        </IconButton>

        <IconButton onClick={handleProfileMenuOpen}>
          <Avatar
            src={user?.profilePicture}
            alt={user?.displayName}
            sx={{ width: 32, height: 32 }}
          >
            {user?.displayName?.charAt(0)}
          </Avatar>
        </IconButton>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
            },
          }}
        >
          <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile/saved'); }}>
            <ListItemIcon>
              <Bookmark fontSize="small" />
            </ListItemIcon>
            <ListItemText>Saved</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/settings'); }}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </Toolbar>
  );
};

export default Header;