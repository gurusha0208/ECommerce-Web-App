import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Card,
  CardMedia,
  Chip,
  Rating,
  Divider,
  IconButton,
  ButtonGroup,
  Alert,
  CircularProgress,
  Paper,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Add,
  Remove,
  ShoppingCart,
  Favorite,
  Share,
  LocalShipping,
  Security,
  Verified,
  ArrowBack,
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductQuery } from '../store/api/productsApi';
import { addItemToCart } from '../store/slices/cartSlice';
import { RootState } from '../store';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data: product, isLoading, error } = useGetProductQuery(Number(id));

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stockQuantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!product) return;

    const cartItem = {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
      totalPrice: product.price * quantity,
      addedAt: new Date().toISOString(),
    };

    dispatch(addItemToCart(cartItem));
    
    // Show success message or redirect to cart
    // For now, we'll just show an alert
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          Product not found or failed to load. Please try again later.
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  const isOutOfStock = product.stockQuantity === 0;
  const images = product.imageUrl ? [product.imageUrl] : ['/placeholder-product.jpg'];

  return (
    <Container sx={{ mt: 2, mb: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to="/products" underline="hover" color="inherit">
          Products
        </Link>
        <Link component={RouterLink} to={`/products?category=${product.categoryId}`} underline="hover" color="inherit">
          {product.categoryName}
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              sx={{ height: 400, objectFit: 'cover' }}
              image={images[selectedImage]}
              alt={product.name}
            />
          </Card>
          
          {/* Thumbnail images (if multiple) */}
          {images.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'center' }}>
              {images.map((image, index) => (
                <Card
                  key={index}
                  sx={{
                    width: 80,
                    height: 80,
                    cursor: 'pointer',
                    border: selectedImage === index ? 2 : 0,
                    borderColor: 'primary.main',
                  }}
                  onClick={() => setSelectedImage(index)}
                >
                  <CardMedia
                    component="img"
                    sx={{ height: '100%', objectFit: 'cover' }}
                    image={image}
                    alt={`${product.name} ${index + 1}`}
                  />
                </Card>
              ))}
            </Box>
          )}
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h4" component="h1" fontWeight="bold">
                {product.name}
              </Typography>
              <Box>
                <IconButton
                  onClick={() => setIsFavorite(!isFavorite)}
                  color={isFavorite ? 'error' : 'default'}
                >
                  <Favorite />
                </IconButton>
                <IconButton onClick={handleShare}>
                  <Share />
                </IconButton>
              </Box>
            </Box>

            {/* Price and Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                ${product.price.toFixed(2)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rating value={4.5} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary">
                  (124 reviews)
                </Typography>
              </Box>
            </Box>

            {/* Status and SKU */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Chip
                label={isOutOfStock ? 'Out of Stock' : `${product.stockQuantity} in stock`}
                color={isOutOfStock ? 'error' : 'success'}
                icon={isOutOfStock ? undefined : <Verified />}
              />
              <Chip label={`SKU: ${product.sku}`} variant="outlined" />
              <Chip label={product.categoryName} variant="outlined" />
            </Box>

            {/* Description */}
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Quantity and Add to Cart */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Quantity
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <ButtonGroup variant="outlined">
                  <IconButton
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Remove />
                  </IconButton>
                  <Button disabled sx={{ minWidth: 60 }}>
                    {quantity}
                  </Button>
                  <IconButton
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stockQuantity}
                  >
                    <Add />
                  </IconButton>
                </ButtonGroup>
                <Typography variant="body2" color="text.secondary">
                  {product.stockQuantity} available
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                fullWidth
                sx={{ py: 1.5 }}
              >
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </Box>

            {/* Features */}
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Why choose this product?
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocalShipping color="primary" />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      Free Shipping
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      On orders over $50
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Security color="primary" />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      Secure Payment
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      100% secure payment
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Verified color="primary" />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      Quality Guarantee
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      30-day return policy
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Additional Information */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Product Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Specifications
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">SKU:</Typography>
                  <Typography variant="body2" fontWeight="bold">{product.sku}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Category:</Typography>
                  <Typography variant="body2" fontWeight="bold">{product.categoryName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Status:</Typography>
                  <Typography variant="body2" fontWeight="bold">{product.status}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Added:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Shipping & Returns
              </Typography>
              <Typography variant="body2" paragraph>
                • Free shipping on orders over $50
              </Typography>
              <Typography variant="body2" paragraph>
                • Standard delivery: 3-5 business days
              </Typography>
              <Typography variant="body2" paragraph>
                • Express delivery: 1-2 business days
              </Typography>
              <Typography variant="body2" paragraph>
                • 30-day return policy
              </Typography>
              <Typography variant="body2">
                • Free returns and exchanges
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductDetail;