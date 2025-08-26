import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Search,
  FilterList,
  GetApp,
  Visibility,
  LocalShipping,
  Star,
  RefreshRounded,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock order data
const mockOrders = [
  {
    id: 'ORD-2024-001',
    date: '2024-01-20',
    status: 'Delivered',
    total: 149.99,
    itemCount: 3,
    shippingAddress: '123 Main St, Anytown, ST 12345',
    estimatedDelivery: '2024-01-22',
    actualDelivery: '2024-01-21',
    items: [
      {
        id: 1,
        name: 'Wireless Bluetooth Headphones',
        price: 79.99,
        quantity: 1,
        imageUrl: '/headphones.jpg'
      },
      {
        id: 2,
        name: 'Phone Case',
        price: 24.99,
        quantity: 2,
        imageUrl: '/phone-case.jpg'
      },
      {
        id: 3,
        name: 'Screen Protector',
        price: 19.99,
        quantity: 1,
        imageUrl: '/screen-protector.jpg'
      }
    ],
    tracking: {
      number: 'TRK123456789',
      carrier: 'FedEx',
      status: 'Delivered',
      updates: [
        { date: '2024-01-21 14:30', status: 'Delivered', location: 'Anytown, ST' },
        { date: '2024-01-21 10:15', status: 'Out for delivery', location: 'Anytown, ST' },
        { date: '2024-01-20 18:45', status: 'In transit', location: 'Distribution Center' },
        { date: '2024-01-20 09:00', status: 'Shipped', location: 'Fulfillment Center' }
      ]
    }
  },
  {
    id: 'ORD-2024-002',
    date: '2024-01-18',
    status: 'Shipped',
    total: 89.50,
    itemCount: 2,
    shippingAddress: '456 Oak Ave, Another City, ST 67890',
    estimatedDelivery: '2024-01-23',
    items: [
      {
        id: 4,
        name: 'Smart Watch',
        price: 199.99,
        quantity: 1,
        imageUrl: '/smart-watch.jpg'
      },
      {
        id: 5,
        name: 'Watch Band',
        price: 29.99,
        quantity: 1,
        imageUrl: '/watch-band.jpg'
      }
    ],
    tracking: {
      number: 'TRK987654321',
      carrier: 'UPS',
      status: 'In Transit',
      updates: [
        { date: '2024-01-19 16:20', status: 'In transit', location: 'City Hub' },
        { date: '2024-01-19 08:30', status: 'In transit', location: 'Regional Facility' },
        { date: '2024-01-18 14:15', status: 'Shipped', location: 'Fulfillment Center' }
      ]
    }
  },
  {
    id: 'ORD-2024-003',
    date: '2024-01-15',
    status: 'Processing',
    total: 65.99,
    itemCount: 1,
    shippingAddress: '789 Pine St, Somewhere, ST 54321',
    estimatedDelivery: '2024-01-25',
    items: [
      {
        id: 6,
        name: 'Laptop Stand',
        price: 65.99,
        quantity: 1,
        imageUrl: '/laptop-stand.jpg'
      }
    ]
  }
];

const OrderRow: React.FC<{ order: any; onViewDetails: (order: any) => void }> = ({ 
  order, 
  onViewDetails 
}) => {
  const [open, setOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const canTrack = order.tracking && ['shipped', 'delivered'].includes(order.status.toLowerCase());

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{order.id}</TableCell>
        <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
        <TableCell>
          <Chip 
            label={order.status} 
            color={getStatusColor(order.status) as any}
            size="small"
          />
        </TableCell>
        <TableCell>{order.itemCount} items</TableCell>
        <TableCell>${order.total.toFixed(2)}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Visibility />}
              onClick={() => onViewDetails(order)}
            >
              Details
            </Button>
            {canTrack && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<LocalShipping />}
              >
                Track
              </Button>
            )}
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Order Items
              </Typography>
              <List dense>
                {order.items.map((item: any) => (
                  <ListItem key={item.id}>
                    <ListItemAvatar>
                      <Avatar
                        src={item.imageUrl}
                        alt={item.name}
                        variant="rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 
                            `https://via.placeholder.com/60x60/f5f5f5/666?text=${item.name[0]}`;
                        }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.name}
                      secondary={`Quantity: ${item.quantity} × $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}`}
                    />
                  </ListItem>
                ))}
              </List>
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Typography variant="body2">
                  <strong>Shipping Address:</strong> {order.shippingAddress}
                </Typography>
              </Box>
              {order.estimatedDelivery && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Estimated Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleDateString()}
                </Typography>
              )}
              {order.actualDelivery && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Delivered On:</strong> {new Date(order.actualDelivery).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [orders] = useState(mockOrders);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some((item: any) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleReorder = (order: any) => {
    // Add items from this order to cart
    console.log('Reordering:', order.items);
    // Navigate to cart or show confirmation
    navigate('/cart');
  };

  const handleWriteReview = (item: any) => {
    console.log('Writing review for:', item.name);
    // Navigate to review page or open review modal
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Order History
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search orders or products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Filter by Status"
              >
                <MenuItem value="all">All Orders</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={5}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                startIcon={<FilterList />}
                variant="outlined"
              >
                More Filters
              </Button>
              <Button
                startIcon={<GetApp />}
                variant="outlined"
              >
                Export
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Orders Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell><strong>Order ID</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Items</strong></TableCell>
                <TableCell><strong>Total</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="h6" color="text.secondary">
                        No orders found
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {searchTerm || statusFilter !== 'all' 
                          ? 'Try adjusting your search or filters' 
                          : "You haven't placed any orders yet"}
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => navigate('/products')}
                      >
                        Start Shopping
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onViewDetails={handleViewDetails}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Order Details Modal */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Order Details - {selectedOrder?.id}</Typography>
            <Chip 
              label={selectedOrder?.status} 
              color={selectedOrder ? 
                (['delivered'].includes(selectedOrder.status.toLowerCase()) ? 'success' :
                 ['shipped'].includes(selectedOrder.status.toLowerCase()) ? 'info' :
                 ['processing'].includes(selectedOrder.status.toLowerCase()) ? 'warning' : 'default') 
                : 'default' as any}
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              {/* Order Summary */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Order Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(selectedOrder.date).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Total Amount
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        ${selectedOrder.total.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Shipping Address
                      </Typography>
                      <Typography variant="body1">
                        {selectedOrder.shippingAddress}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Items */}
              <Typography variant="h6" gutterBottom>
                Items Ordered
              </Typography>
              <List>
                {selectedOrder.items.map((item: any, index: number) => (
                  <React.Fragment key={item.id}>
                    <ListItem
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <Avatar
                          src={item.imageUrl}
                          alt={item.name}
                          variant="rounded"
                          sx={{ width: 60, height: 60, mr: 2 }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 
                              `https://via.placeholder.com/60x60/f5f5f5/666?text=${item.name[0]}`;
                          }}
                        />
                        <ListItemText
                          primary={item.name}
                          secondary={`Quantity: ${item.quantity} × $${item.price.toFixed(2)}`}
                        />
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body1" fontWeight="bold">
                          ${(item.quantity * item.price).toFixed(2)}
                        </Typography>
                        {selectedOrder.status === 'Delivered' && (
                          <Button
                            size="small"
                            startIcon={<Star />}
                            onClick={() => handleWriteReview(item)}
                            sx={{ mt: 1 }}
                          >
                            Review
                          </Button>
                        )}
                      </Box>
                    </ListItem>
                    {index < selectedOrder.items.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>

              {/* Tracking Information */}
              {selectedOrder.tracking && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Tracking Information
                  </Typography>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Tracking Number: {selectedOrder.tracking.number} ({selectedOrder.tracking.carrier})
                  </Alert>
                  
                  <List>
                    {selectedOrder.tracking.updates.map((update: any, index: number) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={update.status}
                          secondary={`${new Date(update.date).toLocaleString()} - ${update.location}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>
            Close
          </Button>
          {selectedOrder && ['delivered', 'shipped'].includes(selectedOrder.status.toLowerCase()) && (
            <Button
              startIcon={<RefreshRounded />}
              onClick={() => handleReorder(selectedOrder)}
              variant="contained"
            >
              Reorder
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderHistoryPage;