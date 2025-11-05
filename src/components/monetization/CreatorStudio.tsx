import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  MonetizationOn,
  TrendingUp,
  PlayArrow,
  Favorite,
  People,
  Assessment,
  Settings,
  Paid,
  Star,
  CardGiftcard,
} from '@mui/icons-material';
import { CreatorBonus, SubscriptionTier, Analytics } from '@/types';

interface CreatorStudioProps {
  userId: string;
}

const CreatorStudio: React.FC<CreatorStudioProps> = ({ userId }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [subscriptionPrice, setSubscriptionPrice] = useState(4.99);
  const [subscriptionBenefits, setSubscriptionBenefits] = useState(['']);

  // Mock monetization data
  const earnings = {
    total: 1247.50,
    thisMonth: 342.75,
    lastMonth: 298.20,
    growth: 14.9,
  };

  const creatorBonuses: CreatorBonus[] = [
    {
      id: '1',
      type: 'reel_play',
      amount: 1200,
      currency: 'USD',
      period: 'September 2024',
      earned: 850,
      threshold: 1000,
      isActive: true,
    },
    {
      id: '2',
      type: 'story_view',
      amount: 500,
      currency: 'USD',
      period: 'September 2024',
      earned: 125,
      threshold: 50000,
      isActive: true,
    },
  ];

  const subscriptionStats = {
    totalSubscribers: 156,
    monthlyRevenue: 768.44,
    averageSubscriptionValue: 4.99,
    churnRate: 5.2,
  };

  const brandedContentDeals = [
    {
      id: '1',
      brand: 'Tech Company',
      campaign: 'Product Launch',
      value: 2500,
      status: 'active',
      deliverables: ['1 Reel', '3 Stories', '1 Post'],
      deadline: new Date('2024-12-15'),
    },
    {
      id: '2',
      brand: 'Fashion Brand',
      campaign: 'Summer Collection',
      value: 1800,
      status: 'pending',
      deliverables: ['2 Posts', '5 Stories'],
      deadline: new Date('2024-12-01'),
    },
  ];

  const EarningsOverview = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Earnings
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  ${earnings.total}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUp color="success" fontSize="small" />
                  <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                    +{earnings.growth}%
                  </Typography>
                </Box>
              </Box>
              <MonetizationOn color="primary" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              This Month
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              ${earnings.thisMonth}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              vs ${earnings.lastMonth} last month
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Subscribers
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {subscriptionStats.totalSubscribers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ${subscriptionStats.monthlyRevenue}/month
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Avg. Subscription
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              ${subscriptionStats.averageSubscriptionValue}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subscriptionStats.churnRate}% churn rate
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Creator Bonuses */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Creator Bonuses
            </Typography>
            {creatorBonuses.map((bonus) => (
              <Box key={bonus.id} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {bonus.type === 'reel_play' ? 'Reels Play Bonus' : 'Story Views Bonus'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {bonus.period}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" fontWeight="bold">
                      ${bonus.earned}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      of ${bonus.amount}
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(bonus.earned / bonus.amount) * 100}
                  sx={{ height: 8, borderRadius: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {Math.round((bonus.earned / bonus.amount) * 100)}% complete
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const SubscriptionsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Subscription Settings</Typography>
              <Button
                variant="contained"
                startIcon={<Star />}
                onClick={() => setShowSubscriptionDialog(true)}
              >
                Manage Subscription
              </Button>
            </Box>

            <Typography variant="body1" sx={{ mb: 2 }}>
              Offer exclusive content to your subscribers for a monthly fee.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Card variant="outlined" sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    ${subscriptionStats.averageSubscriptionValue}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Price
                  </Typography>
                </CardContent>
              </Card>
              
              <Card variant="outlined" sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {subscriptionStats.totalSubscribers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Subscribers
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Subscriber Benefits:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Exclusive content access" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Subscriber-only live streams" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Direct messages priority" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Special subscriber badge" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const BrandedContentTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Active Branded Content Deals
            </Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Brand</TableCell>
                    <TableCell>Campaign</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Deadline</TableCell>
                    <TableCell>Deliverables</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {brandedContentDeals.map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell>{deal.brand}</TableCell>
                      <TableCell>{deal.campaign}</TableCell>
                      <TableCell>${deal.value}</TableCell>
                      <TableCell>
                        <Chip
                          label={deal.status}
                          color={deal.status === 'active' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{deal.deadline.toLocaleDateString()}</TableCell>
                      <TableCell>
                        {deal.deliverables.map((item, index) => (
                          <Chip
                            key={index}
                            label={item}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Brand Partnership Tools
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <CardGiftcard color="primary" sx={{ mb: 1 }} />
                    <Typography variant="subtitle1" fontWeight="bold">
                      Brand Collaboration Posts
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tag brands and disclose partnerships automatically
                    </Typography>
                    <Button size="small" sx={{ mt: 1 }}>
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Assessment color="primary" sx={{ mb: 1 }} />
                    <Typography variant="subtitle1" fontWeight="bold">
                      Campaign Analytics
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Track performance metrics for branded content
                    </Typography>
                    <Button size="small" sx={{ mt: 1 }}>
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const PayoutTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Available for Payout
            </Typography>
            <Typography variant="h3" fontWeight="bold" color="success.main">
              ${earnings.thisMonth}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Minimum payout: $100
            </Typography>
            <Button
              variant="contained"
              fullWidth
              disabled={earnings.thisMonth < 100}
              startIcon={<Paid />}
            >
              Request Payout
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Payout Settings
            </Typography>
            
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Automatic monthly payouts"
              sx={{ mb: 2, display: 'flex' }}
            />
            
            <TextField
              fullWidth
              label="PayPal Email"
              defaultValue="creator@example.com"
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Tax ID"
              placeholder="Enter your tax identification number"
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Payout History
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Oct 1, 2024</TableCell>
                    <TableCell>$298.20</TableCell>
                    <TableCell>PayPal</TableCell>
                    <TableCell>
                      <Chip label="Completed" color="success" size="small" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sep 1, 2024</TableCell>
                    <TableCell>$245.10</TableCell>
                    <TableCell>PayPal</TableCell>
                    <TableCell>
                      <Chip label="Completed" color="success" size="small" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const addSubscriptionBenefit = () => {
    setSubscriptionBenefits([...subscriptionBenefits, '']);
  };

  const updateSubscriptionBenefit = (index: number, value: string) => {
    const newBenefits = [...subscriptionBenefits];
    newBenefits[index] = value;
    setSubscriptionBenefits(newBenefits);
  };

  const removeSubscriptionBenefit = (index: number) => {
    if (subscriptionBenefits.length > 1) {
      setSubscriptionBenefits(subscriptionBenefits.filter((_, i) => i !== index));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Creator Studio
      </Typography>

      <Tabs
        value={selectedTab}
        onChange={(_, newValue) => setSelectedTab(newValue)}
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Overview" icon={<Assessment />} />
        <Tab label="Subscriptions" icon={<Star />} />
        <Tab label="Branded Content" icon={<CardGiftcard />} />
        <Tab label="Payouts" icon={<Paid />} />
      </Tabs>

      {selectedTab === 0 && <EarningsOverview />}
      {selectedTab === 1 && <SubscriptionsTab />}
      {selectedTab === 2 && <BrandedContentTab />}
      {selectedTab === 3 && <PayoutTab />}

      {/* Subscription Settings Dialog */}
      <Dialog
        open={showSubscriptionDialog}
        onClose={() => setShowSubscriptionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Subscription Settings</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="number"
            label="Monthly Price (USD)"
            value={subscriptionPrice}
            onChange={(e) => setSubscriptionPrice(Number(e.target.value))}
            sx={{ mb: 2 }}
            inputProps={{ min: 0.99, max: 99.99, step: 0.01 }}
          />

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Subscription Benefits:
          </Typography>
          
          {subscriptionBenefits.map((benefit, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder={`Benefit ${index + 1}`}
                value={benefit}
                onChange={(e) => updateSubscriptionBenefit(index, e.target.value)}
              />
              {subscriptionBenefits.length > 1 && (
                <Button
                  color="error"
                  onClick={() => removeSubscriptionBenefit(index)}
                >
                  Remove
                </Button>
              )}
            </Box>
          ))}
          
          <Button onClick={addSubscriptionBenefit} sx={{ mt: 1 }}>
            Add Benefit
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubscriptionDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => setShowSubscriptionDialog(false)}
          >
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreatorStudio;