import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Avatar,
  LinearProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Dashboard,
  TrendingUp,
  TrendingDown,
  People,
  ShoppingCart,
  LocalShipping,
  AttachMoney,
  Inventory,
  Analytics,
  Settings,
  Edit,
  Delete,
  Add,
  Visibility,
  MoreVert,
  CheckCircle,
  Cancel,
  Warning,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

// Mock data for the dashboard
const salesData = [
  { name: 'Jan', sales: 4000, orders: 24 },
  { name: 'Feb', sales: 3000, orders: 18 },
  { name: 'Mar', sales: 5000, orders: 32 },
  { name: 'Apr', sales: 4500, orders: 28 },
  { name: 'May', sales: 6000, orders: 38 },
  { name: 'Jun', sales: 5500, orders: 35 },
];

const categoryData = [
  { name: 'Electronics', value: 400, color: '#0088FE' },
  { name: 'Clothing', value: 300, color: '#00C49F' },
  { name: 'Home & Garden', value: 200, color: '#FFBB28' },
  { name: 'Books', value: 100, color: '#FF8042' },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'John Doe', total: 89.99, status: 'Shipped', date: '2024-01-20' },
  { id: 'ORD-002', customer: 'Jane Smith', total: 156.50, status: 'Processing', date: '2024-01-20' },
  { id: 'ORD-003', customer: 'Bob Johnson', total: 45.99, status: 'Delivered', date: '2024-01-19' },
  { id: 'ORD-004', customer: 'Alice Brown', total: 234.99, status: 'Pending', date: '2024-01-19' },
];

const lowStockProducts = [
  { id: 1, name: 'Wireless Headphones', stock: 5, minStock: 10 },
  { id: 2, name: 'Phone Case', stock: 3, minStock: 15 },
  { id: 3, name: 'Laptop Stand', stock: 2, minStock: 8 },
];

const recentCustomers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', orders: 15, totalSpent: 1250.00, joinDate: '2023-12-01' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 8, totalSpent: 890.50, joinDate: '2024-01-05' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', orders: 22, totalSpent: 2100.75, joinDate: '2023-10-15' },
];

const AdminDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOrderStatusChange = (orderId: string, newStatus: string) => {
    console.log(`Changing order ${orderId} status to ${newStatus}`);
    // Here you would call your API to update the order status
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'warning';
      case 'pending': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change: string;
    changeType: 'positive' | 'negative';
    icon: React.ReactNode;
  }> = ({ title, value, change, changeType, icon }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {changeType === 'positive' ? (
                <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
              ) : (
                <TrendingDown sx={{ color: 'error.main', fontSize: 16, mr: 0.5 }} />
              )}
              <Typography 
                variant="body2" 
                color={changeType === 'positive' ? 'success.main' : 'error.main'}
              >
                {change}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ color: 'primary.main' }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Admin Dashboard
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab icon={<Dashboard />} label="Overview" />
        <Tab icon={<Analytics />} label="Analytics" />
        <Tab icon={<ShoppingCart />} label="Orders" />
        <Tab icon={<Inventory />} label="Products" />
        <Tab icon={<People />} label="Customers" />
        <Tab icon={<Settings />} label="Settings" />
      </Tabs>

      {/* Overview Tab */}
      <TabPanel value={tabValue} index={0}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Revenue"
              value="$45,890"
              change="+12.5%"
              changeType="positive"
              icon={<AttachMoney sx={{ fontSize: 40 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Orders"
              value="1,247"
              change="+8.2%"
              changeType="positive"
              icon={<ShoppingCart sx={{ fontSize: 40 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Customers"
              value="892"
              change="+15.1%"
              changeType="positive"
              icon={<People sx={{ fontSize: 40 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending Orders"
              value="23"
              change="-5.3%"
              changeType="negative"
              icon={<LocalShipping sx={{ fontSize: 40 }} />}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Sales Chart */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Sales Overview
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Sales ($)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Recent Orders */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Recent Orders
              </Typography>
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {recentOrders.map((order, index) => (
                  <React.Fragment key={order.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2">
                              {order.id}
                            </Typography>
                            <Chip
                              label={order.status}
                              size="small"
                              color={getStatusColor(order.status) as any}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {order.customer}
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              ${order.total.toFixed(2)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentOrders.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                View All Orders
              </Button>
            </Paper>
          </Grid>

          {/* Low Stock Alert */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Warning color="warning" />
                Low Stock Alert
              </Typography>
              <List>
                {lowStockProducts.map((product) => (
                  <ListItem key={product.id} sx={{ px: 0 }}>
                    <ListItemText
                      primary={product.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Current Stock: {product.stock} | Min Stock: {product.minStock}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(product.stock / product.minStock) * 100}
                            color={product.stock <= 5 ? 'error' : 'warning'}
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Top Categories */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Sales by Category
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Monthly Sales Comparison
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" name="Sales ($)" />
                  <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Orders Tab */}
      <TabPanel value={tabValue} index={2}>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Order ID</strong></TableCell>
                  <TableCell><strong>Customer</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Total</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={order.status}
                          onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Processing">Processing</MenuItem>
                          <MenuItem value="Shipped">Shipped</MenuItem>
                          <MenuItem value="Delivered">Delivered</MenuItem>
                          <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedOrder(order);
                          setOrderDialogOpen(true);
                        }}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      {/* Products Tab */}
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Products Management</Typography>
          <Button variant="contained" startIcon={<Add />}>
            Add New Product
          </Button>
        </Box>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          Product management features would be implemented here, including product listing, 
          editing, inventory management, and category assignment.
        </Alert>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Low Stock Products
          </Typography>
          <List>
            {lowStockProducts.map((product) => (
              <ListItem key={product.id}>
                <ListItemText
                  primary={product.name}
                  secondary={`Stock: ${product.stock} | Min: ${product.minStock}`}
                />
                <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                  Restock
                </Button>
                <Button size="small" variant="outlined">
                  Edit
                </Button>
              </ListItem>
            ))}
          </List>
        </Paper>
      </TabPanel>

      {/* Customers Tab */}
      <TabPanel value={tabValue} index={4}>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Customer</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Orders</strong></TableCell>
                  <TableCell><strong>Total Spent</strong></TableCell>
                  <TableCell><strong>Join Date</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar>{customer.name[0]}</Avatar>
                        {customer.name}
                      </Box>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.orders}</TableCell>
                    <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                    <TableCell>{new Date(customer.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      {/* Settings Tab */}
      <TabPanel value={tabValue} index={5}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                General Settings
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField fullWidth label="Store Name" defaultValue="My E-commerce Store" />
                <TextField fullWidth label="Store Email" defaultValue="admin@store.com" />
                <TextField fullWidth label="Store Phone" defaultValue="+1 (555) 123-4567" />
                <TextField 
                  fullWidth 
                  multiline 
                  rows={3} 
                  label="Store Description" 
                  defaultValue="Your one-stop shop for quality products"
                />
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                System Settings
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Email Notifications"
                    secondary="Send order notifications to customers"
                  />
                  <input type="checkbox" defaultChecked />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Low Stock Alerts"
                    secondary="Alert when products are low in stock"
                  />
                  <input type="checkbox" defaultChecked />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Maintenance Mode"
                    secondary="Put the store in maintenance mode"
                  />
                  <input type="checkbox" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Order Details Dialog */}
      <Dialog open={orderDialogOpen} onClose={() => setOrderDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <Typography>Customer: {selectedOrder.customer}</Typography>
              <Typography>Date: {new Date(selectedOrder.date).toLocaleDateString()}</Typography>
              <Typography>Total: ${selectedOrder.total.toFixed(2)}</Typography>
              <Typography>Status: {selectedOrder.status}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderDialogOpen(false)}>Close</Button>
          <Button variant="contained">Update Order</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;