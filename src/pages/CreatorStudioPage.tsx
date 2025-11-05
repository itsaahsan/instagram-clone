import React from 'react';
import CreatorStudio from '@/components/monetization/CreatorStudio';
import { useAuth } from '@/contexts/AuthContext';

const CreatorStudioPage: React.FC = () => {
  const { user } = useAuth();

  return <CreatorStudio userId={user?.id || ''} />;
};

export default CreatorStudioPage;