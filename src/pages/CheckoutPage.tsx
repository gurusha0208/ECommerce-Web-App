import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
} from '@mui/material';
import {
  CreditCard,
  LocalShipping,
  Security,
  CheckCircle,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { clearCart } from '../store/slices/cartSlice';

const steps = ['Shipping Address', 'Payment Method', 'Review Order'];

const shippingSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('ZIP code is required'),
  country: yup.string().required('Country is required'),
});

const paymentSchema = yup.object({
  cardNumber: yup.string().required('Card number is required'),
  expiryDate: yup.string().required('Expiry date is required'),
  cvv: yup.string().required('CVV is required'),
  cardName: yup.string().required('Cardholder name is required'),
});

interface ShippingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const { cart } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);

  const shippingForm = useForm<ShippingFormData>({
    resolver: yupResolver(shippingSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phoneNumber || '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    },
  });

  const paymentForm = useForm<PaymentFormData>({
    resolver: yupResolver(paymentSchema),
  });

  if (!cart || cart.items.length === 0) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">
          Your cart is empty. Please add some items before checking out.
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  const shippingCost = shippingMethod === 'express' ? 15.99 : 
                     shippingMethod === 'overnight' ? 29.99 : 
                     cart.totalAmount > 50 ? 0 : 5.99;
  
  const tax = cart.totalAmount * 0.08; // 8% tax
  const grandTotal = cart.totalAmount + shippingCost + tax;

  const handleNext = () => {
    if (activeStep === 0) {
      shippingForm.handleSubmit(() => setActiveStep(1))();
    } else if (activeStep === 1) {
      paymentForm.handleSubmit(() => setActiveStep(2))();
    } else {
      handlePlaceOrder();
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically call your order API
      // const orderData = {
      //   items: cart.items,
      //   shipping: shippingForm.getValues(),
      //   payment: paymentForm.getValues(),
      //   shippingMethod,
      //   paymentMethod,
      //   totals: { subtotal: cart.totalAmount, shipping: shippingCost, tax, total: grandTotal }
      // };
      // await createOrder(orderData);

      setOrderComplete(true);
      dispatch(clearCart());
    } catch (error) {
      console.error('Order failed:', error);
      alert('Order failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Order Placed Successfully!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Thank you for your order. You will receive a confirmation email shortly.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/profile/orders')}
            sx={{ mr: 2 }}
          >
            View Orders
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 2, mb: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Step 1: Shipping Address */}
          {activeStep === 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Shipping Address
              </Typography>
              <Box component="form">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      {...shippingForm.register('firstName')}
                      error={!!shippingForm.formState.errors.firstName}
                      helperText={shippingForm.formState.errors.firstName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      {...shippingForm.register('lastName')}
                      error={!!shippingForm.formState.errors.lastName}
                      helperText={shippingForm.formState.errors.lastName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      {...shippingForm.register('email')}
                      error={!!shippingForm.formState.errors.email}
                      helperText={shippingForm.formState.errors.email?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      {...shippingForm.register('phone')}
                      error={!!shippingForm.formState.errors.phone}
                      helperText={shippingForm.formState.errors.phone?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      {...shippingForm.register('address')}
                      error={!!shippingForm.formState.errors.address}
                      helperText={shippingForm.formState.errors.address?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="City"
                      {...shippingForm.register('city')}
                      error={!!shippingForm.formState.errors.city}
                      helperText={shippingForm.formState.errors.city?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="State"
                      {...shippingForm.register('state')}
                      error={!!shippingForm.formState.errors.state}
                      helperText={shippingForm.formState.errors.state?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="ZIP Code"
                      {...shippingForm.register('zipCode')}
                      error={!!shippingForm.formState.errors.zipCode}
                      helperText={shippingForm.formState.errors.zipCode?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Country"
                      {...shippingForm.register('country')}
                      error={!!shippingForm.formState.errors.country}
                      helperText={shippingForm.formState.errors.country?.message}
                    />
                  </Grid>
                </Grid>

                {/* Shipping Methods */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Shipping Method
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={shippingMethod}
                      onChange={(e) => setShippingMethod(e.target.value)}
                    >
                      <FormControlLabel
                        value="standard"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body1">
                              Standard Shipping (5-7 business days)
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {cart.totalAmount > 50 ? 'FREE' : '$5.99'}
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="express"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body1">
                              Express Shipping (2-3 business days)
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              $15.99
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="overnight"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body1">
                              Overnight Shipping (1 business day)
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              $29.99
                            </Typography>
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Box>
            </Paper>
          )}

          {/* Step 2: Payment Method */}
          {activeStep === 1 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Payment Method
              </Typography>
              
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel
                    value="card"
                    control={<Radio />}
                    label="Credit/Debit Card"
                  />
                  <FormControlLabel
                    value="paypal"
                    control={<Radio />}
                    label="PayPal"
                  />
                </RadioGroup>
              </FormControl>

              {paymentMethod === 'card' && (
                <Box component="form">
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Card Number"
                        placeholder="1234 5678 9012 3456"
                        {...paymentForm.register('cardNumber')}
                        error={!!paymentForm.formState.errors.cardNumber}
                        helperText={paymentForm.formState.errors.cardNumber?.message}
                        InputProps={{
                          startAdornment: <CreditCard sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Cardholder Name"
                        {...paymentForm.register('cardName')}
                        error={!!paymentForm.formState.errors.cardName}
                        helperText={paymentForm.formState.errors.cardName?.message}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        placeholder="MM/YY"
                        {...paymentForm.register('expiryDate')}
                        error={!!paymentForm.formState.errors.expiryDate}
                        helperText={paymentForm.formState.errors.expiryDate?.message}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="CVV"
                        placeholder="123"
                        {...paymentForm.register('cvv')}
                        error={!!paymentForm.formState.errors.cvv}
                        helperText={paymentForm.formState.errors.cvv?.message}
                        InputProps={{
                          startAdornment: <Security sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {paymentMethod === 'paypal' && (
                <Alert severity="info">
                  You will be redirected to PayPal to complete your payment.
                </Alert>
              )}
            </Paper>
          )}

          {/* Step 3: Review Order */}
          {activeStep === 2 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Review Your Order
              </Typography>
              
              {/* Shipping Info */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Shipping Address
                  </Typography>
                  <Typography variant="body2">
                    {shippingForm.getValues('firstName')} {shippingForm.getValues('lastName')}
                  </Typography>
                  <Typography variant="body2">
                    {shippingForm.getValues('address')}
                  </Typography>
                  <Typography variant="body2">
                    {shippingForm.getValues('city')}, {shippingForm.getValues('state')} {shippingForm.getValues('zipCode')}
                  </Typography>
                  <Typography variant="body2">
                    {shippingForm.getValues('country')}
                  </Typography>
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Payment Method
                  </Typography>
                  {paymentMethod === 'card' ? (
                    <Typography variant="body2">
                      Credit Card ending in {paymentForm.getValues('cardNumber')?.slice(-4) || '****'}
                    </Typography>
                  ) : (
                    <Typography variant="body2">PayPal</Typography>
                  )}
                </CardContent>
              </Card>

              {/* Order Items */}
              <Typography variant="subtitle1" gutterBottom>
                Order Items
              </Typography>
              <List>
                {cart.items.map((item) => (
                  <ListItem key={item.productId} divider>
                    <ListItemAvatar>
                      <Avatar src={item.imageUrl} alt={item.productName} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.productName}
                      secondary={`Quantity: ${item.quantity} × ${item.price.toFixed(2)}`}
                    />
                    <Typography variant="body2" fontWeight="bold">
                      ${item.totalPrice.toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
              </List>

              <FormControlLabel
                control={<Checkbox required />}
                label="I agree to the Terms and Conditions"
                sx={{ mt: 2 }}
              />
            </Paper>
          )}

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<ArrowBack />}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={isProcessing}
              endIcon={isProcessing ? <CircularProgress size={20} /> : 
                      activeStep === steps.length - 1 ? <CheckCircle /> : <ArrowForward />}
            >
              {isProcessing ? 'Processing...' : 
               activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
            </Button>
          </Box>
        </Grid>

        {/* Order Summary Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <List dense>
              {cart.items.map((item) => (
                <ListItem key={item.productId} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar src={item.imageUrl} alt={item.productName} sx={{ width: 40, height: 40 }} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" noWrap>
                        {item.productName}
                      </Typography>
                    }
                    secondary={`${item.quantity} × ${item.price.toFixed(2)}`}
                  />
                  <Typography variant="body2">
                    ${item.totalPrice.toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Subtotal:</Typography>
              <Typography variant="body2">${cart.totalAmount.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Shipping:</Typography>
              <Typography variant="body2">
                {shippingCost === 0 ? 'FREE' : `${shippingCost.toFixed(2)}`}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2">Tax:</Typography>
              <Typography variant="body2">${tax.toFixed(2)}</Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">Total:</Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                ${grandTotal.toFixed(2)}
              </Typography>
            </Box>

            {/* Security Features */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <Security sx={{ fontSize: 20, color: 'success.main' }} />
              <Typography variant="caption" color="text.secondary">
                Secure checkout with SSL encryption
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;