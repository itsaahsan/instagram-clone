import React from 'react';
import ShopTab from '@/components/shopping/ShopTab';
import { useAuth } from '@/contexts/AuthContext';

const ShoppingPage: React.FC = () => {
  const { user } = useAuth();

  return <ShopTab userId={user?.id || ''} isOwnProfile={true} />;
};

export default ShoppingPage;