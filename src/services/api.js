import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Tests'],
  endpoints: (builder) => ({
    checkDbConnection: builder.mutation({
      query: () => ({
        url: 'connection',
        method: 'GET',
      }),
    }),
    getTests: builder.query({
      query: () => 'tests',
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Tests', id: _id })), { type: 'Tests', id: 'LIST' }]
          : [{ type: 'Tests', id: 'LIST' }],
    }),
    createTest: builder.mutation({
      query: (newTest) => ({
        url: 'tests',
        method: 'POST',
        body: newTest,
      }),
      invalidatesTags: [{ type: 'Tests', id: 'LIST' }],
    }),
    updateTest: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `tests/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Tests', id }],
    }),
    deleteTest: builder.mutation({
        query: (id) => ({
            url: `tests/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: (result, error, id) => [{ type: 'Tests', id }, { type: 'Tests', id: 'LIST' }],
    })
  }),
});

export const { 
    useCheckDbConnectionMutation, 
    useGetTestsQuery, 
    useCreateTestMutation,
    useUpdateTestMutation,
    useDeleteTestMutation,
} = api;
