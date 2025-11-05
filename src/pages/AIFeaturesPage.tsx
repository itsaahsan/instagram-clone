import React from 'react';
import AIFeatures from '@/components/ai/AIFeatures';
import { useAuth } from '@/contexts/AuthContext';

const AIFeaturesPage: React.FC = () => {
  const { user } = useAuth();

  return <AIFeatures userId={user?.id || ''} />;
};

export default AIFeaturesPage;