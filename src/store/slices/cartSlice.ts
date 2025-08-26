import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cart, CartItem } from '../../types';

interface CartState {
  cart: Cart | null;
  isOpen: boolean;
  loading: boolean;
}

const initialState: CartState = {
  cart: null,
  isOpen: false,
  loading: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
      state.loading = false;
    },
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      if (state.cart) {
        const existingItemIndex = state.cart.items.findIndex(
          item => item.productId === action.payload.productId
        );

        if (existingItemIndex >= 0) {
          state.cart.items[existingItemIndex].quantity += action.payload.quantity;
          state.cart.items[existingItemIndex].totalPrice = 
            state.cart.items[existingItemIndex].quantity * state.cart.items[existingItemIndex].price;
        } else {
          state.cart.items.push(action.payload);
        }

        state.cart.totalItems = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
        state.cart.totalAmount = state.cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
      }
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      if (state.cart) {
        state.cart.items = state.cart.items.filter(item => item.productId !== action.payload);
        state.cart.totalItems = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
        state.cart.totalAmount = state.cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
      }
    },
    updateItemQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      if (state.cart) {
        const item = state.cart.items.find(item => item.productId === action.payload.productId);
        if (item) {
          item.quantity = action.payload.quantity;
          item.totalPrice = item.quantity * item.price;
          state.cart.totalItems = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
          state.cart.totalAmount = state.cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
        }
      }
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearCart: (state) => {
      state.cart = null;
    },
  },
});

export const {
  setCart,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  toggleCart,
  closeCart,
  setLoading,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;