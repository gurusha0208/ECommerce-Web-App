import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper,
  Chip,
  Rating,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  LocalOffer,
  Star,
  ArrowForward,
  ShoppingCart,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery, useGetCategoriesQuery } from '../store/api/productsApi';
import { SearchCriteria } from '../types';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Fetch featured products
  const featuredCriteria: SearchCriteria = {
    pageNumber: 1,
    pageSize: 8,
    sortBy: 'created',
    sortDescending: true,
  };

  const { data: featuredProducts, isLoading: featuredLoading } = useGetProductsQuery(featuredCriteria);
  const { data: categories } = useGetCategoriesQuery();

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/products?category=${categoryId}`);
  };

  const handleViewAllProducts = () => {
    navigate('/products');
  };

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                Discover Amazing Products
              </Typography>
              <Typography variant="h5" paragraph color="rgba(255,255,255,0.9)">
                Shop the latest trends and find exactly what you're looking for
                with our curated collection of premium products.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 1.5,
                    mr: 2,
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                  onClick={handleViewAllProducts}
                >
                  Shop Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    '&:hover': { borderColor: 'grey.300', bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                  onClick={() => navigate('/categories')}
                >
                  Browse Categories
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/hero-shopping.jpg"
                alt="Shopping Hero"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400/667eea/white?text=Shop+Now';
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container>
        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
            Why Choose Us?
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            We provide the best shopping experience with quality products and excellent service
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <TrendingUp sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Latest Trends
                </Typography>
                <Typography color="text.secondary">
                  Stay ahead with our curated collection of trending products
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <LocalOffer sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Best Prices
                </Typography>
                <Typography color="text.secondary">
                  Competitive pricing with regular deals and discounts
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <Star sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Quality Guaranteed
                </Typography>
                <Typography color="text.secondary">
                  All products are carefully selected for quality and durability
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Categories Section */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight="bold">
              Shop by Category
            </Typography>
            <Button
              endIcon={<ArrowForward />}
              onClick={() => navigate('/categories')}
            >
              View All Categories
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {categories?.slice(0, 6).map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={category.imageUrl || `https://via.placeholder.com/300x160/f5f5f5/666?text=${encodeURIComponent(category.name)}`}
                    alt={category.name}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Featured Products Section */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight="bold">
              Featured Products
            </Typography>
            <Button
              endIcon={<ArrowForward />}
              onClick={handleViewAllProducts}
            >
              View All Products
            </Button>
          </Box>

          {featuredLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : featuredProducts?.items.length === 0 ? (
            <Alert severity="info">No featured products available at the moment.</Alert>
          ) : (
            <Grid container spacing={3}>
              {featuredProducts?.items.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => handleProductClick(product.id)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.imageUrl || '/placeholder-product.jpg'}
                      alt={product.name}
                    />
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography gutterBottom variant="h6" component="div" noWrap>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                        {product.description.length > 80
                          ? `${product.description.substring(0, 80)}...`
                          : product.description
                        }
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          ${product.price.toFixed(2)}
                        </Typography>
                        <Rating value={4.5} precision={0.5} size="small" readOnly />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          label={product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                          color={product.stockQuantity > 0 ? 'success' : 'error'}
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {product.categoryName}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Newsletter Section */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Stay Updated
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Subscribe to our newsletter to get the latest updates on new products and exclusive deals
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, maxWidth: 400, mx: 'auto' }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
              }}
            />
            <Button variant="contained" size="large">
              Subscribe
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;