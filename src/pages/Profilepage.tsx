import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Avatar,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
  Alert,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  ShoppingBag,
  LocationOn,
  CreditCard,
  Security,
  Notifications,
  Person,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const profileSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: yup.string().required('Phone number is required'),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
});

const ProfilePage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const profileForm = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    },
  });

  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
  });

  // Mock data for orders and addresses
  const recentOrders = [
    {
      id: '12345',
      date: '2024-01-15',
      status: 'Delivered',
      total: 89.99,
      items: 3,
    },
    {
      id: '12344',
      date: '2024-01-10',
      status: 'Shipped',
      total: 156.50,
      items: 5,
    },
    {
      id: '12343',
      date: '2024-01-05',
      status: 'Processing',
      total: 45.99,
      items: 2,
    },
  ];

  const savedAddresses = [
    {
      id: 1,
      label: 'Home',
      address: '123 Main St, Anytown, ST 12345',
      isDefault: true,
    },
    {
      id: 2,
      label: 'Work',
      address: '456 Business Ave, Corporate City, ST 67890',
      isDefault: false,
    },
  ];

  const savedCards = [
    {
      id: 1,
      last4: '4242',
      brand: 'Visa',
      expiry: '12/25',
      isDefault: true,
    },
    {
      id: 2,
      last4: '8888',
      brand: 'Mastercard',
      expiry: '08/26',
      isDefault: false,
    },
  ];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = profileForm.handleSubmit((data) => {
    console.log('Saving profile:', data);
    // Here you would call your API to update the profile
    setIsEditing(false);
  });

  const handleCancelEdit = () => {
    profileForm.reset();
    setIsEditing(false);
  };

  const handleChangePassword = passwordForm.handleSubmit((data) => {
    console.log('Changing password:', data);
    // Here you would call your API to change the password
    setPasswordDialogOpen(false);
    passwordForm.reset();
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                sx={{ width: 80, height: 80 }}
                src="/profile-avatar.jpg"
              >
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Avatar>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {user?.email}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {user?.roles.map((role) => (
                    <Chip key={role} label={role} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Tabs */}
        <Grid item xs={12}>
          <Paper>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab icon={<Person />} label="Profile" />
              <Tab icon={<ShoppingBag />} label="Orders" />
              <Tab icon={<LocationOn />} label="Addresses" />
              <Tab icon={<CreditCard />} label="Payment Methods" />
              <Tab icon={<Security />} label="Security" />
              <Tab icon={<Notifications />} label="Notifications" />
            </Tabs>

            {/* Profile Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">Personal Information</Typography>
                  {!isEditing ? (
                    <Button startIcon={<Edit />} onClick={handleEditProfile}>
                      Edit Profile
                    </Button>
                  ) : (
                    <Box>
                      <Button
                        startIcon={<Save />}
                        onClick={handleSaveProfile}
                        variant="contained"
                        sx={{ mr: 1 }}
                      >
                        Save
                      </Button>
                      <Button
                        startIcon={<Cancel />}
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      {...profileForm.register('firstName')}
                      disabled={!isEditing}
                      error={!!profileForm.formState.errors.firstName}
                      helperText={profileForm.formState.errors.firstName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      {...profileForm.register('lastName')}
                      disabled={!isEditing}
                      error={!!profileForm.formState.errors.lastName}
                      helperText={profileForm.formState.errors.lastName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      {...profileForm.register('email')}
                      disabled={!isEditing}
                      error={!!profileForm.formState.errors.email}
                      helperText={profileForm.formState.errors.email?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      {...profileForm.register('phoneNumber')}
                      disabled={!isEditing}
                      error={!!profileForm.formState.errors.phoneNumber}
                      helperText={profileForm.formState.errors.phoneNumber?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Member Since"
                      value={new Date(user?.createdAt || '').toLocaleDateString()}
                      disabled
                    />
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>

            {/* Orders Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Orders
                </Typography>
                {recentOrders.length === 0 ? (
                  <Alert severity="info">You haven't placed any orders yet.</Alert>
                ) : (
                  <List>
                    {recentOrders.map((order) => (
                      <React.Fragment key={order.id}>
                        <ListItem>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="subtitle1">
                                  Order #{order.id}
                                </Typography>
                                <Chip
                                  label={order.status}
                                  size="small"
                                  color={getStatusColor(order.status) as any}
                                />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  {new Date(order.date).toLocaleDateString()} • {order.items} items
                                </Typography>
                                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                  ${order.total.toFixed(2)}
                                </Typography>
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Button size="small" variant="outlined">
                              View Details
                            </Button>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Box>
            </TabPanel>

            {/* Addresses Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">Saved Addresses</Typography>
                  <Button variant="contained">Add New Address</Button>
                </Box>
                <Grid container spacing={2}>
                  {savedAddresses.map((address) => (
                    <Grid item xs={12} sm={6} key={address.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {address.label}
                            </Typography>
                            <Box>
                              {address.isDefault && (
                                <Chip label="Default" size="small" color="primary" sx={{ mb: 1 }} />
                              )}
                              <IconButton size="small">
                                <Edit fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {address.address}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </TabPanel>

            {/* Payment Methods Tab */}
            <TabPanel value={tabValue} index={3}>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">Payment Methods</Typography>
                  <Button variant="contained">Add New Card</Button>
                </Box>
                <Grid container spacing={2}>
                  {savedCards.map((card) => (
                    <Grid item xs={12} sm={6} key={card.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CreditCard />
                              <Typography variant="subtitle1" fontWeight="bold">
                                **** {card.last4}
                              </Typography>
                            </Box>
                            <Box>
                              {card.isDefault && (
                                <Chip label="Default" size="small" color="primary" sx={{ mb: 1 }} />
                              )}
                              <IconButton size="small">
                                <Edit fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {card.brand} • Expires {card.expiry}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </TabPanel>

            {/* Security Tab */}
            <TabPanel value={tabValue} index={4}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Account Security
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="subtitle1" gutterBottom>
                              Password
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Last changed 30 days ago
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            onClick={() => setPasswordDialogOpen(true)}
                          >
                            Change Password
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="subtitle1" gutterBottom>
                              Two-Factor Authentication
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Add an extra layer of security to your account
                            </Typography>
                          </Box>
                          <Button variant="outlined">
                            Enable 2FA
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="subtitle1" gutterBottom>
                              Login Sessions
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Manage your active login sessions
                            </Typography>
                          </Box>
                          <Button variant="outlined">
                            View Sessions
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>

            {/* Notifications Tab */}
            <TabPanel value={tabValue} index={5}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Notification Preferences
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Email Notifications
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <label>
                            <input type="checkbox" defaultChecked /> Order updates
                          </label>
                          <label>
                            <input type="checkbox" defaultChecked /> Promotions and deals
                          </label>
                          <label>
                            <input type="checkbox" /> Newsletter
                          </label>
                          <label>
                            <input type="checkbox" /> Product recommendations
                          </label>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Push Notifications
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <label>
                            <input type="checkbox" defaultChecked /> Order status updates
                          </label>
                          <label>
                            <input type="checkbox" /> Flash sales
                          </label>
                          <label>
                            <input type="checkbox" /> Back in stock alerts
                          </label>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              {...passwordForm.register('currentPassword')}
              error={!!passwordForm.formState.errors.currentPassword}
              helperText={passwordForm.formState.errors.currentPassword?.message}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="New Password"
              {...passwordForm.register('newPassword')}
              error={!!passwordForm.formState.errors.newPassword}
              helperText={passwordForm.formState.errors.newPassword?.message}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              {...passwordForm.register('confirmPassword')}
              error={!!passwordForm.formState.errors.confirmPassword}
              helperText={passwordForm.formState.errors.confirmPassword?.message}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleChangePassword} variant="contained">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;