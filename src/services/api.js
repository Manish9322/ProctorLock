import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Tests', 'Questions', 'Candidates', 'Assignments'],
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
      invalidatesTags: (result, error, { id }) => [{ type: 'Tests', id }, { type: 'Tests', id: 'LIST' }],
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
    }),
    getCandidates: builder.query({
        query: () => 'candidates',
        providesTags: (result) =>
            result
            ? [...result.map(({ _id }) => ({ type: 'Candidates', id: _id })), { type: 'Candidates', id: 'LIST' }]
            : [{ type: 'Candidates', id: 'LIST' }],
    }),
    getAssignmentsForTest: builder.query({
      query: (testId) => `assignments/${testId}`,
       providesTags: (result, error, testId) => [{ type: 'Assignments', id: testId }],
    }),
    assignCandidate: builder.mutation({
      query: ({ testId, candidateId }) => ({
        url: 'assignments',
        method: 'POST',
        body: { test: testId, candidate: candidateId },
      }),
      invalidatesTags: (result, error, { testId }) => [{ type: 'Assignments', id: testId }],
    }),
    unassignCandidate: builder.mutation({
      query: (assignmentId) => ({
        url: `assignments/${assignmentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, assignmentId) => {
        // We don't know the testId here, so we have to be less specific.
        // A better approach would be returning the full object from the DELETE and using that.
        // For now, just invalidate the general list for all tests.
        return [{ type: 'Assignments' }];
      },
    }),
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
    useGetCandidatesQuery,
    useGetAssignmentsForTestQuery,
    useAssignCandidateMutation,
    useUnassignCandidateMutation,
} = api;

    