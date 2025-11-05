import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Badge,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  ShoppingBag,
  Favorite,
  FavoriteBorder,
  Share,
  Add,
  Remove,
  LocalShipping,
  Security,
  Store,
} from '@mui/icons-material';
import { Product, ShoppingItem, ShopSection } from '@/types';

interface ShopTabProps {
  userId: string;
  isOwnProfile: boolean;
}

const ShopTab: React.FC<ShopTabProps> = ({ userId, isOwnProfile }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [shoppingBag, setShoppingBag] = useState<ShoppingItem[]>([]);

  // Mock data for shop sections
  const shopSections: ShopSection[] = [
    {
      id: '1',
      userId,
      name: 'Featured',
      isActive: true,
      createdAt: new Date(),
      products: [
        {
          id: '1',
          name: 'Summer Collection Dress',
          price: 89.99,
          currency: 'USD',
          image: '/images/product1.jpg',
          url: 'https://shop.example.com/dress1',
          merchant: 'Fashion Store',
          description: 'Beautiful summer dress perfect for any occasion',
          availability: 'in_stock',
        },
        {
          id: '2',
          name: 'Wireless Headphones',
          price: 199.99,
          currency: 'USD',
          image: '/images/product2.jpg',
          url: 'https://shop.example.com/headphones1',
          merchant: 'Tech Store',
          description: 'High-quality wireless headphones with noise cancellation',
          availability: 'limited',
        },
      ],
    },
    {
      id: '2',
      userId,
      name: 'New Arrivals',
      isActive: true,
      createdAt: new Date(),
      products: [
        {
          id: '3',
          name: 'Organic Skincare Set',
          price: 45.00,
          currency: 'USD',
          image: '/images/product3.jpg',
          url: 'https://shop.example.com/skincare1',
          merchant: 'Beauty Co.',
          description: 'Natural organic skincare for all skin types',
          availability: 'in_stock',
        },
      ],
    },
  ];

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDialog(true);
    setQuantity(1);
    setSelectedVariant('');
  };

  const addToBag = () => {
    if (selectedProduct) {
      const existingItem = shoppingBag.find(item => item.product.id === selectedProduct.id);
      if (existingItem) {
        setShoppingBag(shoppingBag.map(item =>
          item.product.id === selectedProduct.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ));
      } else {
        setShoppingBag([...shoppingBag, {
          id: Date.now().toString(),
          product: selectedProduct,
          quantity,
        }]);
      }
      setShowProductDialog(false);
    }
  };

  const getAvailabilityChip = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return <Chip label="In Stock" color="success" size="small" />;
      case 'limited':
        return <Chip label="Limited" color="warning" size="small" />;
      case 'out_of_stock':
        return <Chip label="Out of Stock" color="error" size="small" />;
      default:
        return null;
    }
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <Card sx={{ cursor: 'pointer' }} onClick={() => handleProductClick(product)}>
      <CardMedia
        component="img"
        height={200}
        image={product.image}
        alt={product.name}
      />
      <CardContent sx={{ p: 1 }}>
        <Typography variant="body2" fontWeight="bold" noWrap>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {product.merchant}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            ${product.price}
          </Typography>
          {getAvailabilityChip(product.availability)}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Shop
        </Typography>
        <IconButton>
          <Badge badgeContent={shoppingBag.length} color="primary">
            <ShoppingBag />
          </Badge>
        </IconButton>
      </Box>

      {/* Shop Sections Tabs */}
      <Tabs
        value={selectedTab}
        onChange={(_, newValue) => setSelectedTab(newValue)}
        sx={{ mb: 2 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {shopSections.map((section, index) => (
          <Tab key={section.id} label={section.name} />
        ))}
      </Tabs>

      {/* Products Grid */}
      {shopSections[selectedTab] && (
        <Grid container spacing={2}>
          {shopSections[selectedTab].products.map((product) => (
            <Grid item xs={6} sm={4} md={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Product Detail Dialog */}
      <Dialog
        open={showProductDialog}
        onClose={() => setShowProductDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedProduct && (
          <>
            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                {/* Product Image */}
                <Box sx={{ flex: 1, minHeight: 400 }}>
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>

                {/* Product Info */}
                <Box sx={{ flex: 1, p: 3 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {selectedProduct.name}
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    by {selectedProduct.merchant}
                  </Typography>

                  <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
                    ${selectedProduct.price}
                  </Typography>

                  {getAvailabilityChip(selectedProduct.availability)}

                  <Typography variant="body1" sx={{ my: 2 }}>
                    {selectedProduct.description}
                  </Typography>

                  {/* Quantity Selector */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
                    <Typography variant="body1">Quantity:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Remove />
                      </IconButton>
                      <Typography variant="body1" sx={{ minWidth: 30, textAlign: 'center' }}>
                        {quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Add />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={addToBag}
                      startIcon={<ShoppingBag />}
                      disabled={selectedProduct.availability === 'out_of_stock'}
                    >
                      Add to Bag
                    </Button>
                    <IconButton>
                      <FavoriteBorder />
                    </IconButton>
                    <IconButton>
                      <Share />
                    </IconButton>
                  </Box>

                  {/* Trust Badges */}
                  <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<Security />}
                      label="Secure Payment"
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<LocalShipping />}
                      label="Free Shipping"
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<Store />}
                      label="Verified Merchant"
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setShowProductDialog(false)}>
                Close
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.open(selectedProduct.url, '_blank')}
              >
                View on Website
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Shopping Bag Summary */}
      {shoppingBag.length > 0 && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            bgcolor: 'primary.main',
            color: 'white',
            p: 2,
            borderRadius: 2,
            minWidth: 200,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Shopping Bag ({shoppingBag.length})
          </Typography>
          <Typography variant="body2">
            Total: ${shoppingBag.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ mt: 1 }}
          >
            Checkout
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ShopTab;