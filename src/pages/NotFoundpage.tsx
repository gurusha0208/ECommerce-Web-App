import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
} from '@mui/material';
import {
  Home,
  ArrowBack,
  Search,
  ShoppingCart,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 8, mb: 8 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            {/* 404 Illustration */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '6rem', sm: '8rem', md: '10rem' },
                  fontWeight: 'bold',
                  color: 'primary.main',
                  lineHeight: 1,
                }}
              >
                404
              </Typography>
            </Box>

            {/* Error Message */}
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Page Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, 
              or you entered the wrong URL. Don't worry, let's get you back on track!
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Home />}
                onClick={() => navigate('/')}
                sx={{ minWidth: 140 }}
              >
                Go Home
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ minWidth: 140 }}
              >
                Go Back
              </Button>
            </Box>

            {/* Helpful Links */}
            <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" gutterBottom>
                Maybe you were looking for:
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  startIcon={<ShoppingCart />}
                  onClick={() => navigate('/products')}
                  color="inherit"
                >
                  Products
                </Button>
                <Button
                  startIcon={<Search />}
                  onClick={() => navigate('/search')}
                  color="inherit"
                >
                  Search
                </Button>
                <Button
                  onClick={() => navigate('/contact')}
                  color="inherit"
                >
                  Contact Us
                </Button>
                <Button
                  onClick={() => navigate('/help')}
                  color="inherit"
                >
                  Help Center
                </Button>
              </Box>
            </Box>

            {/* Contact Information */}
            <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Still can't find what you're looking for? 
                <br />
                Contact our support team at{' '}
                <strong>support@example.com</strong> or call{' '}
                <strong>1-800-123-4567</strong>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NotFoundPage;