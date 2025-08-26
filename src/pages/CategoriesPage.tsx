import React from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { useGetCategoriesQuery } from '../store/api/productsApi';
import { motion } from 'framer-motion';
import { blue } from '@mui/material/colors';

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: categories } = useGetCategoriesQuery();

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/products?category=${categoryId}`);
  };

  // Animation settings
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // delay between each card
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <Box sx={{ mb: 8 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 3,
          ml:10
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Shop by Category
        </Typography>
      </Box>

      <Grid
        container
        spacing={10}
        padding={10}
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {categories?.map((category) => (
          <Grid
            item
            xs={12}   // full width on mobile
            sm={6}    // 2 per row on tablet/desktop
            key={category.id}
            component={motion.div}
            variants={cardVariants}
          >
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
                image={
                  category.imageUrl ||
                  `https://via.placeholder.com/400x160/f5f5f5/666?text=${encodeURIComponent(
                    category.name
                  )}`
                }
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
  );
};

export default CategoriesPage;
