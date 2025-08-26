import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
} from '@mui/material';
import { ShoppingCart, Visibility } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { addItemToCart } from '../../store/slices/cartSlice';
import { RootState } from '../../store';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const cartItem = {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      totalPrice: product.price,
      addedAt: new Date().toISOString(),
    };

    dispatch(addItemToCart(cartItem));
  };

  const handleViewProduct = () => {
    navigate(`/products/${product.id}`);
  };

  const isOutOfStock = product.stockQuantity === 0;

  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={product.imageUrl || '/placeholder-product.jpg'}
        alt={product.name}
        sx={{ cursor: 'pointer' }}
        onClick={handleViewProduct}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.description.length > 100 
            ? `${product.description.substring(0, 100)}...` 
            : product.description
          }
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" color="primary">
            ${product.price.toFixed(2)}
          </Typography>
          <Chip 
            label={isOutOfStock ? 'Out of Stock' : `${product.stockQuantity} in stock`}
            color={isOutOfStock ? 'error' : 'success'}
            size="small"
          />
        </Box>
        <Typography variant="caption" color="text.secondary">
          Category: {product.categoryName}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          size="small"
          startIcon={<Visibility />}
          onClick={handleViewProduct}
        >
          View
        </Button>
        <Button
          size="small"
          variant="contained"
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;