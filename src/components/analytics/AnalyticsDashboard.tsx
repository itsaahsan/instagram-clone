import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tabs,
  Tab,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Visibility,
  ThumbUp,
  Person,
  Public,
  Schedule,
  LocationOn,
  Male,
  Female,
} from '@mui/icons-material';
import { Analytics } from '@/types';

interface AnalyticsDashboardProps {
  userId: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ userId }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('week');

  // Mock analytics data
  const analytics: Analytics = {
    period: selectedPeriod,
    overview: {
      accountsReached: 12540,
      contentInteractions: 3245,
      totalFollowers: 8932,
      websiteClicks: 456,
      emailContacts: 23,
      phoneContacts: 12,
      textContacts: 5,
      getDirectionsClicks: 34,
    },
    content: {
      postsShared: 15,
      storiesShared: 45,
      reelsShared: 8,
      topPosts: [], // Would be populated with actual posts
      topReels: [], // Would be populated with actual reels
      topStories: [], // Would be populated with actual stories
    },
    audience: {
      totalFollowers: 8932,
      followersGrowth: 234,
      demographics: {
        ageGroups: {
          '18-24': 35,
          '25-34': 40,
          '35-44': 20,
          '45-54': 5,
        },
        genders: {
          female: 65,
          male: 35,
        },
        topLocations: {
          'New York, NY': 25,
          'Los Angeles, CA': 20,
          'Chicago, IL': 15,
          'Miami, FL': 12,
          'Austin, TX': 10,
        },
      },
      activity: {
        mostActiveHours: {
          '9:00': 15,
          '12:00': 25,
          '18:00': 35,
          '21:00': 40,
        },
        mostActiveDays: {
          Monday: 12,
          Tuesday: 15,
          Wednesday: 18,
          Thursday: 20,
          Friday: 25,
          Saturday: 30,
          Sunday: 28,
        },
      },
    },
    discovery: {
      reach: 15678,
      impressions: 45321,
      sources: {
        home: 45,
        hashtags: 25,
        explore: 20,
        profile: 8,
        other: 2,
      },
    },
  };

  const MetricCard: React.FC<{
    title: string;
    value: number;
    change?: number;
    icon: React.ReactNode;
    format?: 'number' | 'percentage';
  }> = ({ title, value, change, icon, format = 'number' }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {format === 'percentage' ? `${value}%` : value.toLocaleString()}
            </Typography>
            {change !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {change >= 0 ? (
                  <TrendingUp color="success" fontSize="small" />
                ) : (
                  <TrendingDown color="error" fontSize="small" />
                )}
                <Typography
                  variant="body2"
                  color={change >= 0 ? 'success.main' : 'error.main'}
                  sx={{ ml: 0.5 }}
                >
                  {Math.abs(change)}%
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ color: 'primary.main' }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const OverviewTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Accounts Reached"
          value={analytics.overview.accountsReached}
          change={12}
          icon={<Visibility />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Content Interactions"
          value={analytics.overview.contentInteractions}
          change={-5}
          icon={<ThumbUp />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Total Followers"
          value={analytics.overview.totalFollowers}
          change={8}
          icon={<Person />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Website Clicks"
          value={analytics.overview.websiteClicks}
          change={25}
          icon={<Public />}
        />
      </Grid>

      {/* Contact Actions */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Contact Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold">
                    {analytics.overview.emailContacts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold">
                    {analytics.overview.phoneContacts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Phone
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold">
                    {analytics.overview.textContacts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Text
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold">
                    {analytics.overview.getDirectionsClicks}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Directions
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const ContentTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <MetricCard
          title="Posts Shared"
          value={analytics.content.postsShared}
          change={15}
          icon={<Public />}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <MetricCard
          title="Stories Shared"
          value={analytics.content.storiesShared}
          change={-8}
          icon={<Schedule />}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <MetricCard
          title="Reels Shared"
          value={analytics.content.reelsShared}
          change={45}
          icon={<Visibility />}
        />
      </Grid>

      {/* Top Content */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Performing Content
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your best performing posts from the last {selectedPeriod}
            </Typography>
            {/* Would render actual top posts here */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                No content data available for this period
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const AudienceTab = () => (
    <Grid container spacing={3}>
      {/* Follower Growth */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Followers
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {analytics.audience.totalFollowers.toLocaleString()}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TrendingUp color="success" fontSize="small" />
              <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                +{analytics.audience.followersGrowth} this {selectedPeriod}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Demographics */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Gender Distribution
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Female color="primary" />
              <Typography variant="body1">
                {analytics.audience.demographics.genders.female}%
              </Typography>
              <Male color="secondary" />
              <Typography variant="body1">
                {analytics.audience.demographics.genders.male}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={analytics.audience.demographics.genders.female}
              sx={{ height: 8, borderRadius: 1 }}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Age Groups */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Age Groups
            </Typography>
            {Object.entries(analytics.audience.demographics.ageGroups).map(([age, percentage]) => (
              <Box key={age} sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{age}</Typography>
                  <Typography variant="body2">{percentage}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{ height: 6, borderRadius: 1 }}
                />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Top Locations */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Locations
            </Typography>
            <List dense>
              {Object.entries(analytics.audience.demographics.topLocations).map(([location, percentage]) => (
                <ListItem key={location}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      <LocationOn fontSize="small" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={location}
                    secondary={`${percentage}% of followers`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Activity Times */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              When Your Followers Are Most Active
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Most Active Hours
                </Typography>
                {Object.entries(analytics.audience.activity.mostActiveHours).map(([hour, percentage]) => (
                  <Box key={hour} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{hour}</Typography>
                      <Typography variant="body2">{percentage}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{ height: 4, borderRadius: 1 }}
                    />
                  </Box>
                ))}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Most Active Days
                </Typography>
                {Object.entries(analytics.audience.activity.mostActiveDays).map(([day, percentage]) => (
                  <Box key={day} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{day}</Typography>
                      <Typography variant="body2">{percentage}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{ height: 4, borderRadius: 1 }}
                    />
                  </Box>
                ))}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const DiscoveryTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <MetricCard
          title="Reach"
          value={analytics.discovery.reach}
          change={18}
          icon={<Visibility />}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <MetricCard
          title="Impressions"
          value={analytics.discovery.impressions}
          change={12}
          icon={<TrendingUp />}
        />
      </Grid>

      {/* Discovery Sources */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Discovery Sources
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Where people discover your content
            </Typography>
            {Object.entries(analytics.discovery.sources).map(([source, percentage]) => (
              <Box key={source} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    {source}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {percentage}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Insights
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Period</InputLabel>
          <Select
            value={selectedPeriod}
            label="Period"
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
          >
            <MenuItem value="day">Last Day</MenuItem>
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Tabs */}
      <Tabs
        value={selectedTab}
        onChange={(_, newValue) => setSelectedTab(newValue)}
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Overview" />
        <Tab label="Content" />
        <Tab label="Audience" />
        <Tab label="Discovery" />
      </Tabs>

      {/* Tab Content */}
      {selectedTab === 0 && <OverviewTab />}
      {selectedTab === 1 && <ContentTab />}
      {selectedTab === 2 && <AudienceTab />}
      {selectedTab === 3 && <DiscoveryTab />}
    </Box>
  );
};

export default AnalyticsDashboard;