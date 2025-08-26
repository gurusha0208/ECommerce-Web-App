// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors: string[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Product types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  categoryId: number;
  categoryName: string;
  status: string;
  imageUrl: string;
  stockQuantity: number;
  createdAt: string;
}

export interface SearchCriteria {
  searchTerm?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDescending: boolean;
}

// Auth types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roles: string[];
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

// Cart types
export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
  totalPrice: number;
  addedAt: string;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}