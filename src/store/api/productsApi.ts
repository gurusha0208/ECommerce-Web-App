import { baseApi } from './baseApi';
import { Product, SearchCriteria, PagedResult, ApiResponse } from '../../types';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<PagedResult<Product>, SearchCriteria>({
      query: (criteria) => ({
        url: 'products',
        params: criteria,
      }),
      transformResponse: (response: ApiResponse<PagedResult<Product>>) => response.data!,
      providesTags: ['Product'],
    }),
    getProduct: builder.query<Product, number>({
      query: (id) => `products/${id}`,
      transformResponse: (response: ApiResponse<Product>) => response.data!,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    getCategories: builder.query<any[], void>({
      query: () => 'categories',
      transformResponse: (response: ApiResponse<any[]>) => response.data!,
    }),
  }),
});

export const { 
  useGetProductsQuery, 
  useGetProductQuery,
  useGetCategoriesQuery 
} = productsApi;