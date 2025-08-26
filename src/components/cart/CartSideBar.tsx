import React from 'react';
import {
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Box,
  Divider,
  ButtonGroup,
  Alert,
  Chip,
  Paper,
  Fade,
} from '@mui/material';
import { 
  Close, 
  Add, 
  Remove, 
  ShoppingCartCheckout, 
  ShoppingCart,
  Delete,
  LocalShipping,
  Security
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { closeCart, updateItemQuantity, removeItemFromCart } from '../../store/slices/cartSlice';

const CartSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, isOpen, loading } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleClose = () => {
    dispatch(closeCart());
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeItemFromCart(productId));
    } else {
      dispatch(updateItemQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeItemFromCart(productId));
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
    handleClose();
  };

  const handleContinueShopping = () => {
    navigate('/products');
    handleClose();
  };

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
    handleClose();
  };

  // Calculate savings (you can implement your own logic)
  const calculateSavings = () => {
    if (!cart?.items) return 0;
    // Example: 5% savings for orders over $100
    return cart.totalAmount > 100 ? cart.totalAmount * 0.05 : 0;
  };

  const savings = calculateSavings();
  const finalTotal = cart ? cart.totalAmount - savings : 0;

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        sx: { 
          width: { xs: '100vw', sm: 450 }, 
          maxWidth: '90vw',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCart color="primary" />
          <Typography variant="h6" component="h2">
            Shopping Cart
          </Typography>
          {cart?.totalItems && (
            <Chip 
              label={cart.totalItems} 
              size="small" 
              color="primary" 
              sx={{ minWidth: 24 }}
            />
          )}
        </Box>
        <IconButton onClick={handleClose} aria-label="Close cart">
          <Close />
        </IconButton>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Updating cart...
          </Typography>
        </Box>
      )}

      {/* Empty Cart State */}
      {!cart || cart.items.length === 0 ? (
        <Fade in timeout={300}>
          <Box sx={{ 
            p: 4, 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            flex: 1,
            justifyContent: 'center'
          }}>
            <ShoppingCart sx={{ fontSize: 64, color: 'text.disabled' }} />
            <Typography variant="h6" color="text.secondary">
              Your cart is empty
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add some products to get started!
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </Button>
          </Box>
        </Fade>
      ) : (
        <>
          {/* User Info */}
          {isAuthenticated && user && (
            <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body2" color="text.secondary">
                Shopping as: <strong>{user.firstName} {user.lastName}</strong>
              </Typography>
            </Box>
          )}

          {/* Cart Items */}
          <List sx={{ 
            flexGrow: 1, 
            overflow: 'auto',
            py: 1
          }}>
            {cart.items.map((item, index) => (
              <Fade in timeout={300} key={item.productId}>
                <ListItem 
                  alignItems="flex-start"
                  sx={{ 
                    py: 2,
                    '&:not(:last-child)': {
                      borderBottom: 1,
                      borderColor: 'divider'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      src={item.imageUrl} 
                      alt={item.productName}
                      sx={{ 
                        width: 56, 
                        height: 56, 
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.8 }
                      }}
                      onClick={() => handleProductClick(item.productId)}
                    />
                  </ListItemAvatar>
                  
                  <ListItemText
                    sx={{ ml: 1 }}
                    primary={
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { color: 'primary.main' },
                          fontWeight: 500,
                          lineHeight: 1.2
                        }}
                        onClick={() => handleProductClick(item.productId)}
                      >
                        {item.productName}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
                          ${item.price.toFixed(2)} each
                        </Typography>
                        
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          mt: 1
                        }}>
                          <ButtonGroup size="small" variant="outlined">
                            <IconButton
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              disabled={loading}
                              size="small"
                            >
                              <Remove fontSize="small" />
                            </IconButton>
                            <Button disabled sx={{ minWidth: 40 }}>
                              {item.quantity}
                            </Button>
                            <IconButton
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              disabled={loading}
                              size="small"
                            >
                              <Add fontSize="small" />
                            </IconButton>
                          </ButtonGroup>
                          
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              ${item.totalPrice.toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    }
                  />
                  
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveItem(item.productId)}
                    size="small"
                    color="error"
                    sx={{ mt: 1 }}
                    disabled={loading}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </ListItem>
              </Fade>
            ))}
          </List>

          {/* Order Summary */}
          <Paper elevation={1} sx={{ m: 2, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">
                Subtotal ({cart.totalItems} items):
              </Typography>
              <Typography variant="body2">
                ${cart.totalAmount.toFixed(2)}
              </Typography>
            </Box>
            
            {savings > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="success.main">
                  Savings:
                </Typography>
                <Typography variant="body2" color="success.main">
                  -${savings.toFixed(2)}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">
                Shipping:
              </Typography>
              <Typography variant="body2" color="success.main">
                FREE
              </Typography>
            </Box>
            
            <Divider sx={{ my: 1 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                Total:
              </Typography>
              <Typography variant="h6" color="primary.main">
                ${finalTotal.toFixed(2)}
              </Typography>
            </Box>

            {/* Benefits */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <LocalShipping fontSize="small" color="success" />
                <Typography variant="caption" color="success.main">
                  Free shipping on all orders
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security fontSize="small" color="info" />
                <Typography variant="caption" color="info.main">
                  Secure checkout guaranteed
                </Typography>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<ShoppingCartCheckout />}
              onClick={handleCheckout}
              disabled={loading}
              sx={{ mb: 1 }}
            >
              {isAuthenticated ? 'Proceed to Checkout' : 'Sign In to Checkout'}
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              onClick={handleContinueShopping}
              disabled={loading}
            >
              Continue Shopping
            </Button>
          </Paper>

          {/* Security Notice */}
          {!isAuthenticated && (
            <Alert severity="info" sx={{ m: 2, mt: 0 }}>
              <Typography variant="caption">
                Sign in to save your cart and get personalized recommendations.
              </Typography>
            </Alert>
          )}
        </>
      )}
    </Drawer>
  );
};

export default CartSidebar;