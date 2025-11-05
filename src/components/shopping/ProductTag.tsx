import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  Rating,
  Divider,
  Link,
} from '@mui/material';
import {
  ShoppingBag,
  Close,
  FavoriteBorder,
  Favorite,
  Share,
  Store,
  LocalShipping,
  AttachMoney,
} from '@mui/icons-material';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  imageUrl: string;
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  shippingInfo?: string;
  seller: {
    id: string;
    name: string;
    verified: boolean;
    avatar?: string;
  };
  category: string;
  tags: string[];
  url: string;
}

interface ProductTagProps {
  product: Product;
  position?: { x: number; y: number };
  onClose?: () => void;
  showDetails?: boolean;
}

const ProductTag: React.FC<ProductTagProps> = ({
  product,
  position = { x: 50, y: 50 },
  onClose,
  showDetails = false,
}) => {
  const [showProductDetails, setShowProductDetails] = useState(showDetails);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const calculateDiscount = () => {
    if (!product.originalPrice) return null;
    const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
    return Math.round(discount);
  };

  const handleViewProduct = () => {
    window.open(product.url, '_blank');
  };

  const handleAddToCart = () => {
    // Simulate add to cart
    console.log('Added to cart:', product.id);
    // In a real app, this would integrate with e-commerce platform
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // In a real app, this would sync with user's wishlist
  };

  // Simple product tag (dot indicator)
  const SimpleTag = () => (
    <Box
      sx={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        zIndex: 10,
      }}
      onClick={() => setShowProductDetails(true)}
    >
      {/* Pulsing dot */}
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          bgcolor: 'white',
          border: '2px solid #1976d2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': {
              boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.7)',
            },
            '70%': {
              boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)',
            },
            '100%': {
              boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)',
            },
          },
        }}
      >
        <ShoppingBag sx={{ fontSize: 12, color: 'primary.main' }} />
      </Box>
    </Box>
  );

  // Compact product preview
  const CompactPreview = () => (
    <Card
      sx={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -100%)',
        width: 250,
        zIndex: 10,
        cursor: 'pointer',
      }}
      onClick={() => setShowProductDetails(true)}
    >
      <Box sx={{ display: 'flex', p: 1 }}>
        <CardMedia
          component="img"
          image={product.imageUrl}
          alt={product.name}
          sx={{ width: 60, height: 60, borderRadius: 1, mr: 1 }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight="bold" noWrap>
            {product.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {product.brand}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Typography variant="subtitle2" color="primary.main">
              {formatPrice(product.price, product.currency)}
            </Typography>
            {product.originalPrice && (
              <Typography
                variant="caption"
                sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
              >
                {formatPrice(product.originalPrice, product.currency)}
              </Typography>
            )}
          </Box>
        </Box>
        {onClose && (
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); onClose(); }}>
            <Close fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Card>
  );

  return (
    <>
      {showDetails ? <CompactPreview /> : <SimpleTag />}

      {/* Detailed Product Modal */}
      <Dialog
        open={showProductDetails}
        onClose={() => setShowProductDetails(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ position: 'relative' }}>
            <IconButton
              onClick={() => setShowProductDetails(false)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                zIndex: 1,
              }}
            >
              <Close />
            </IconButton>
            
            <CardMedia
              component="img"
              image={product.imageUrl}
              alt={product.name}
              sx={{ height: 300, objectFit: 'cover' }}
            />
          </Box>

          <Box sx={{ p: 3 }}>
            {/* Product Info */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                {product.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Avatar src={product.seller.avatar} sx={{ width: 24, height: 24 }}>
                  <Store fontSize="small" />
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  {product.seller.name}
                </Typography>
                {product.seller.verified && (
                  <Chip label="Verified" size="small" color="primary" />
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Rating value={product.rating} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">
                  ({product.reviewCount} reviews)
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" paragraph>
                {product.description}
              </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Pricing */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h5" color="primary.main" fontWeight="bold">
                {formatPrice(product.price, product.currency)}
              </Typography>
              
              {product.originalPrice && (
                <>
                  <Typography
                    variant="body1"
                    sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                  >
                    {formatPrice(product.originalPrice, product.currency)}
                  </Typography>
                  <Chip
                    label={`${calculateDiscount()}% OFF`}
                    size="small"
                    color="error"
                  />
                </>
              )}
            </Box>

            {/* Stock Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: product.inStock ? 'success.main' : 'error.main',
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </Typography>
            </Box>

            {/* Shipping Info */}
            {product.shippingInfo && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocalShipping sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {product.shippingInfo}
                </Typography>
              </Box>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {product.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <IconButton onClick={toggleWishlist} color={isWishlisted ? 'error' : 'default'}>
            {isWishlisted ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          
          <IconButton>
            <Share />
          </IconButton>
          
          <Button
            variant="outlined"
            onClick={handleViewProduct}
            startIcon={<Store />}
          >
            View Product
          </Button>
          
          <Button
            variant="contained"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            startIcon={<ShoppingBag />}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductTag;