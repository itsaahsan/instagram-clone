import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Container,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNavigation from './MobileNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar />
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <Sidebar
          mobile
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <AppBar position="sticky" elevation={0}>
          <Header onMenuClick={handleSidebarToggle} showMenuButton={isMobile} />
        </AppBar>

        {/* Page Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: 2,
            pb: isMobile ? 8 : 2, // Extra padding for mobile navigation
            backgroundColor: 'background.default',
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
            {children}
          </Container>
        </Box>

        {/* Mobile Bottom Navigation */}
        {isMobile && <MobileNavigation />}
      </Box>
    </Box>
  );
};

export default Layout;