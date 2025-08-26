import React, { useState } from 'react';

import {
  Grid,
  Container,
  Typography,
  Box,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Button,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';

import { Search, Clear } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { useGetProductsQuery, useGetCategoriesQuery } from '../../store/api/productsApi';
import { SearchCriteria } from '../../types';
import ProductCard from './ProductCard';

const ProductList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    searchTerm: searchParams.get('search') || undefined,
    categoryId: searchParams.get('category') ? Number(searchParams.get('category')) : undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    pageNumber: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    pageSize: 12,
    sortBy: searchParams.get('sortBy') || 'name',
    sortDescending: searchParams.get('sortDesc') === 'true',
  });

  const { data: productsData, isLoading: productsLoading, error: productsError } = useGetProductsQuery(searchCriteria);
  const { data: categories } = useGetCategoriesQuery();

  const handleSearchChange = (field: keyof SearchCriteria, value: any) => {
    const newCriteria = { ...searchCriteria, [field]: value, pageNumber: 1 };
    setSearchCriteria(newCriteria);
    updateUrlParams(newCriteria);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    const newCriteria = { ...searchCriteria, pageNumber: page };
    setSearchCriteria(newCriteria);
    updateUrlParams(newCriteria);
  };

  const updateUrlParams = (criteria: SearchCriteria) => {
    const params = new URLSearchParams();
    if (criteria.searchTerm) params.set('search', criteria.searchTerm);
    if (criteria.categoryId) params.set('category', criteria.categoryId.toString());
    if (criteria.minPrice) params.set('minPrice', criteria.minPrice.toString());
    if (criteria.maxPrice) params.set('maxPrice', criteria.maxPrice.toString());
    if (criteria.pageNumber > 1) params.set('page', criteria.pageNumber.toString());
    if (criteria.sortBy !== 'name') params.set('sortBy', criteria.sortBy);
    if (criteria.sortDescending) params.set('sortDesc', 'true');
    
    setSearchParams(params);
  };

  const clearFilters = () => {
    const newCriteria: SearchCriteria = {
      searchTerm: '',
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      pageNumber: 1,
      pageSize: 12,
      sortBy: 'name',
      sortDescending: false,
    };
    setSearchCriteria(newCriteria);
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = !!(
    searchCriteria.searchTerm ||
    searchCriteria.categoryId ||
    searchCriteria.minPrice ||
    searchCriteria.maxPrice
  );

  if (productsLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (productsError) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Error loading products. Please try again.</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Search & Filter Products
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search Products"
              value={searchCriteria.searchTerm}
              onChange={(e) => handleSearchChange('searchTerm', e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <Select
                value={searchCriteria.categoryId || ''}
                onChange={(e) => handleSearchChange('categoryId', e.target.value || undefined)}
                displayEmpty
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories?.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} sm={3} md={1.5}>
            <TextField
              fullWidth
              label="Min Price"
              type="number"
              value={searchCriteria.minPrice || ''}
              onChange={(e) => handleSearchChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
          </Grid>
          
          <Grid item xs={6} sm={3} md={1.5}>
            <TextField
              fullWidth
              label="Max Price"
              type="number"
              value={searchCriteria.maxPrice || ''}
              onChange={(e) => handleSearchChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <Select
                value={`${searchCriteria.sortBy}-${searchCriteria.sortDescending}`}
                onChange={(e) => {
                  const [sortBy, sortDesc] = e.target.value.split('-');
                  handleSearchChange('sortBy', sortBy);
                  handleSearchChange('sortDescending', sortDesc === 'true');
                }}
              >
                <MenuItem value="name-false">Name (A-Z)</MenuItem>
                <MenuItem value="name-true">Name (Z-A)</MenuItem>
                <MenuItem value="price-false">Price (Low to High)</MenuItem>
                <MenuItem value="price-true">Price (High to Low)</MenuItem>
                <MenuItem value="created-true">Newest First</MenuItem>
                <MenuItem value="created-false">Oldest First</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {hasActiveFilters && (
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Clear />}
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </Grid>
          )}
        </Grid>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {searchCriteria.searchTerm && (
              <Chip
                label={`Search: ${searchCriteria.searchTerm}`}
                onDelete={() => handleSearchChange('searchTerm', '')}
                size="small"
              />
            )}
            {searchCriteria.categoryId && (
              <Chip
                label={`Category: ${categories?.find(c => c.id === searchCriteria.categoryId)?.name}`}
                onDelete={() => handleSearchChange('categoryId', undefined)}
                size="small"
              />
            )}
            {searchCriteria.minPrice && (
              <Chip
                label={`Min: ${searchCriteria.minPrice}`}
                onDelete={() => handleSearchChange('minPrice', undefined)}
                size="small"
              />
            )}
            {searchCriteria.maxPrice && (
              <Chip
                label={`Max: ${searchCriteria.maxPrice}`}
                onDelete={() => handleSearchChange('maxPrice', undefined)}
                size="small"
              />
            )}
          </Box>
        )}
      </Paper>

      {/* Results Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Products ({productsData?.totalCount || 0})
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          Page {productsData?.pageNumber || 1} of {Math.ceil((productsData?.totalCount || 0) / (productsData?.pageSize || 12))}
        </Typography>
      </Box>

      {/* Products Grid */}
      {productsData?.items.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No products found matching your criteria
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search filters or browse all products
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {productsData?.items.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {productsData && productsData.totalCount > productsData.pageSize && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={Math.ceil(productsData.totalCount / productsData.pageSize)}
            page={productsData.pageNumber}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default ProductList;