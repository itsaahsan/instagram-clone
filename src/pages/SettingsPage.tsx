import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  Divider,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Person,
  Security,
  Notifications,
  PrivacyTip,
  Help,
  Info,
  Language,
  DarkMode,
  LightMode,
  Email,
  Phone,
  Lock,
  Visibility,
  VisibilityOff,
  Edit,
  CameraAlt,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<string>('account');
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [editForm, setEditForm] = useState({
    displayName: user?.displayName || '',
    username: user?.username || '',
    bio: user?.bio || '',
    website: user?.website || '',
    email: user?.email || '',
  });

  // Settings state
  const [settings, setSettings] = useState({
    theme: user?.settings?.theme || 'light',
    language: user?.settings?.language || 'en',
    notifications: {
      likes: user?.settings?.notifications?.likes ?? true,
      comments: user?.settings?.notifications?.comments ?? true,
      follows: user?.settings?.notifications?.follows ?? true,
      mentions: user?.settings?.notifications?.mentions ?? true,
      directMessages: user?.settings?.notifications?.directMessages ?? true,
      liveVideos: user?.settings?.notifications?.liveVideos ?? true,
    },
    privacy: {
      private: user?.settings?.privacy?.private ?? false,
      showActivity: user?.settings?.privacy?.showActivity ?? true,
      allowMessageRequests: user?.settings?.privacy?.allowMessageRequests ?? true,
      allowTagging: user?.settings?.privacy?.allowTagging ?? true,
    },
  });

  const handleEditProfile = async () => {
    try {
      await updateProfile({
        displayName: editForm.displayName,
        username: editForm.username,
        bio: editForm.bio,
        website: editForm.website,
        email: editForm.email,
      });
      setEditProfileOpen(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      // Simulate password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPasswordDialogOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const settingsSections = [
    { id: 'account', label: 'Account', icon: <Person /> },
    { id: 'security', label: 'Security', icon: <Security /> },
    { id: 'notifications', label: 'Notifications', icon: <Notifications /> },
    { id: 'privacy', label: 'Privacy', icon: <PrivacyTip /> },
    { id: 'appearance', label: 'Appearance', icon: settings.theme === 'dark' ? <DarkMode /> : <LightMode /> },
    { id: 'help', label: 'Help', icon: <Help /> },
    { id: 'about', label: 'About', icon: <Info /> },
  ];

  const renderAccountSettings = () => (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={user?.profilePicture}
              sx={{ width: 80, height: 80, mr: 3 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={600}>
                {user?.displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{user?.username}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Edit />}
                onClick={() => setEditProfileOpen(true)}
                sx={{ mt: 1 }}
              >
                Edit Profile
              </Button>
            </Box>
            <IconButton>
              <CameraAlt />
            </IconButton>
          </Box>

          <List dense>
            <ListItem>
              <ListItemIcon><Email /></ListItemIcon>
              <ListItemText primary="Email" secondary={user?.email} />
            </ListItem>
            <ListItem>
              <ListItemIcon><Phone /></ListItemIcon>
              <ListItemText primary="Phone" secondary={user?.phoneNumber || 'Not added'} />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Account Actions
          </Typography>
          <List>
            <ListItemButton onClick={() => setPasswordDialogOpen(true)}>
              <ListItemIcon><Lock /></ListItemIcon>
              <ListItemText primary="Change Password" />
            </ListItemButton>
            <Divider />
            <ListItemButton onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ListItemText primary="Log Out" />
            </ListItemButton>
          </List>
        </CardContent>
      </Card>
    </Box>
  );

  const renderSecuritySettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Security
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Two-Factor Authentication"
              secondary="Add an extra layer of security to your account"
            />
            <Switch
              checked={user?.twoFactorEnabled || false}
              onChange={(e) => {
                if (e.target.checked) {
                  toast.info('Two-factor authentication setup coming soon');
                }
              }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Login Activity"
              secondary="See where you're logged in"
            />
            <Button variant="outlined" size="small">
              View
            </Button>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );

  const renderNotificationSettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Notifications
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Likes" secondary="When someone likes your posts" />
            <Switch
              checked={settings.notifications.likes}
              onChange={(e) => handleSettingChange('notifications', 'likes', e.target.checked)}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Comments" secondary="When someone comments on your posts" />
            <Switch
              checked={settings.notifications.comments}
              onChange={(e) => handleSettingChange('notifications', 'comments', e.target.checked)}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Follows" secondary="When someone follows you" />
            <Switch
              checked={settings.notifications.follows}
              onChange={(e) => handleSettingChange('notifications', 'follows', e.target.checked)}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Mentions" secondary="When someone mentions you" />
            <Switch
              checked={settings.notifications.mentions}
              onChange={(e) => handleSettingChange('notifications', 'mentions', e.target.checked)}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Direct Messages" secondary="When you receive a message" />
            <Switch
              checked={settings.notifications.directMessages}
              onChange={(e) => handleSettingChange('notifications', 'directMessages', e.target.checked)}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Live Videos" secondary="When someone you follow goes live" />
            <Switch
              checked={settings.notifications.liveVideos}
              onChange={(e) => handleSettingChange('notifications', 'liveVideos', e.target.checked)}
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );

  const renderPrivacySettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Privacy
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Private Account"
              secondary="Only people you approve can see your photos and videos"
            />
            <Switch
              checked={settings.privacy.private}
              onChange={(e) => handleSettingChange('privacy', 'private', e.target.checked)}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Show Activity Status"
              secondary="Let people see when you're active or recently active"
            />
            <Switch
              checked={settings.privacy.showActivity}
              onChange={(e) => handleSettingChange('privacy', 'showActivity', e.target.checked)}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Allow Message Requests"
              secondary="Let people send you message requests"
            />
            <Switch
              checked={settings.privacy.allowMessageRequests}
              onChange={(e) => handleSettingChange('privacy', 'allowMessageRequests', e.target.checked)}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Allow Tagging"
              secondary="Allow people to tag you in photos"
            />
            <Switch
              checked={settings.privacy.allowTagging}
              onChange={(e) => handleSettingChange('privacy', 'allowTagging', e.target.checked)}
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );

  const renderAppearanceSettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Appearance
        </Typography>
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Theme</InputLabel>
            <Select
              value={settings.theme}
              label="Theme"
              onChange={(e) => handleSettingChange('theme', '', e.target.value)}
            >
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
              <MenuItem value="auto">Auto</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box>
          <FormControl fullWidth>
            <InputLabel>Language</InputLabel>
            <Select
              value={settings.language}
              label="Language"
              onChange={(e) => handleSettingChange('language', '', e.target.value)}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Español</MenuItem>
              <MenuItem value="fr">Français</MenuItem>
              <MenuItem value="de">Deutsch</MenuItem>
              <MenuItem value="ja">日本語</MenuItem>
              <MenuItem value="zh">中文</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return renderAccountSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'help':
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Help Center
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Visit our help center for more information and support.
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }}>
                Visit Help Center
              </Button>
            </CardContent>
          </Card>
        );
      case 'about':
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                About Instagram Clone
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Version 1.0.0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                A full-featured Instagram clone built with React and TypeScript.
              </Typography>
            </CardContent>
          </Card>
        );
      default:
        return renderAccountSettings();
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', display: 'flex', gap: 3 }}>
      {/* Settings Navigation */}
      <Card sx={{ width: 280, flexShrink: 0 }}>
        <CardContent sx={{ p: 0 }}>
          <List>
            {settingsSections.map((section) => (
              <ListItemButton
                key={section.id}
                selected={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
              >
                <ListItemIcon>{section.icon}</ListItemIcon>
                <ListItemText primary={section.label} />
              </ListItemButton>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Settings Content */}
      <Box sx={{ flex: 1 }}>
        {renderContent()}
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onClose={() => setEditProfileOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Display Name"
              value={editForm.displayName}
              onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Username"
              value={editForm.username}
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              fullWidth
            />
            <TextField
              label="Bio"
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Website"
              value={editForm.website}
              onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              fullWidth
              type="email"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditProfileOpen(false)}>Cancel</Button>
          <Button onClick={handleEditProfile} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Current Password"
              type={showPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsPage;