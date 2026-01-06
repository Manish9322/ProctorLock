import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Tests', 'Questions'],
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
    }),
    getQuestions: builder.query({
      query: () => 'questions',
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Questions', id: _id })), { type: 'Questions', id: 'LIST' }]
          : [{ type: 'Questions', id: 'LIST' }],
    }),
    createQuestion: builder.mutation({
      query: (newQuestion) => ({
        url: 'questions',
        method: 'POST',
        body: newQuestion,
      }),
      invalidatesTags: [{ type: 'Questions', id: 'LIST' }],
    }),
    createBulkQuestions: builder.mutation({
        query: (newQuestions) => ({
            url: 'questions/bulk',
            method: 'POST',
            body: newQuestions,
        }),
        invalidatesTags: [{ type: 'Questions', id: 'LIST' }],
    }),
    updateQuestion: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `questions/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Questions', id }, { type: 'Questions', id: 'LIST' }],
    }),
    deleteQuestion: builder.mutation({
        query: (id) => ({
            url: `questions/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: (result, error, id) => [{ type: 'Questions', id }, { type: 'Questions', id: 'LIST' }],
    })
  }),
});

export const { 
    useCheckDbConnectionMutation, 
    useGetTestsQuery, 
    useCreateTestMutation,
    useUpdateTestMutation,
    useDeleteTestMutation,
    useGetQuestionsQuery,
    useCreateQuestionMutation,
    useUpdateQuestionMutation,
    useDeleteQuestionMutation,
    useCreateBulkQuestionsMutation,
} = api;
