import { baseApi } from './baseApi';
import { AuthResponse, LoginRequest, RegisterRequest, User, ApiResponse } from '../../types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: ApiResponse<AuthResponse>) => response.data!,
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: 'auth/register',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response: ApiResponse<AuthResponse>) => response.data!,
    }),
    getProfile: builder.query<User, void>({
      query: () => 'auth/profile',
      transformResponse: (response: ApiResponse<User>) => response.data!,
      providesTags: ['User'],
    }),
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useGetProfileQuery 
} = authApi;