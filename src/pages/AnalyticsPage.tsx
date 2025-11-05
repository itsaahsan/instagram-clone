import React from 'react';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import { useAuth } from '@/contexts/AuthContext';

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();

  return <AnalyticsDashboard userId={user?.id || ''} />;
};

export default AnalyticsPage;