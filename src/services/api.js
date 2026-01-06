import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Tests', 'Questions', 'Candidates', 'Assignments', 'Roles', 'GovIdTypes', 'Colleges'],
  endpoints: (builder) => ({
    checkDbConnection: builder.mutation({
      query: () => ({
        url: 'connection',
        method: 'GET',
      }),
    }),
    getTests: builder.query({
      query: () => 'tests',
      providesTags: (result = []) =>
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
      providesTags: (result = []) =>
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
        providesTags: (result = []) =>
            result
            ? [...result.map(({ _id }) => ({ type: 'Candidates', id: _id })), { type: 'Candidates', id: 'LIST' }]
            : [{ type: 'Candidates', id: 'LIST' }],
    }),
    updateCandidate: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `candidates/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Candidates', id }, { type: 'Candidates', id: 'LIST' }],
    }),
    deleteCandidate: builder.mutation({
      query: (id) => ({
        url: `candidates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Candidates', id }, { type: 'Candidates', id: 'LIST' }],
    }),
    registerCandidate: builder.mutation({
        query: (candidateData) => ({
            url: 'register',
            method: 'POST',
            body: candidateData,
        }),
        invalidatesTags: [{ type: 'Candidates', id: 'LIST' }]
    }),
    getAssignmentsForTest: builder.query({
      query: (testId) => `assignments/${testId}`,
       providesTags: (result = [], error, testId) => result 
        ? [...result.map(({_id}) => ({ type: 'Assignments', id: _id })), { type: 'Assignments', id: 'LIST' }]
        : [{ type: 'Assignments', id: 'LIST' }],
    }),
    assignCandidate: builder.mutation({
      query: ({ testId, candidateId }) => ({
        url: 'assignments',
        method: 'POST',
        body: { test: testId, candidate: candidateId },
      }),
      invalidatesTags: (result, error, { testId }) => [{ type: 'Assignments', id: 'LIST' }],
    }),
    unassignCandidate: builder.mutation({
      query: (assignmentId) => ({
        url: `assignments/${assignmentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, assignmentId) => [{ type: 'Assignments', id: 'LIST' }],
    }),
    getRoles: builder.query({
      query: () => 'roles',
      providesTags: (result = []) => [...result.map(({ _id }) => ({ type: 'Roles', id: _id })), { type: 'Roles', id: 'LIST' }],
    }),
    createRole: builder.mutation({
      query: (newRole) => ({
        url: 'roles',
        method: 'POST',
        body: newRole,
      }),
      invalidatesTags: [{ type: 'Roles', id: 'LIST' }],
    }),
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Roles', id }, { type: 'Roles', id: 'LIST' }],
    }),
    getGovIdTypes: builder.query({
      query: () => 'govIdTypes',
      providesTags: (result = []) => [...result.map(({ _id }) => ({ type: 'GovIdTypes', id: _id })), { type: 'GovIdTypes', id: 'LIST' }],
    }),
    createGovIdType: builder.mutation({
      query: (newIdType) => ({
        url: 'govIdTypes',
        method: 'POST',
        body: newIdType,
      }),
      invalidatesTags: [{ type: 'GovIdTypes', id: 'LIST' }],
    }),
    deleteGovIdType: builder.mutation({
      query: (id) => ({
        url: `govIdTypes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'GovIdTypes', id }, { type: 'GovIdTypes', id: 'LIST' }],
    }),
     getColleges: builder.query({
      query: () => 'colleges',
      providesTags: (result = []) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Colleges', id: _id })), { type: 'Colleges', id: 'LIST' }]
          : [{ type: 'Colleges', id: 'LIST' }],
    }),
    createCollege: builder.mutation({
        query: (newCollege) => ({
            url: 'colleges',
            method: 'POST',
            body: newCollege,
        }),
        invalidatesTags: [{ type: 'Colleges', id: 'LIST' }],
    }),
    updateCollege: builder.mutation({
        query: ({ id, ...patch }) => ({
            url: `colleges/${id}`,
            method: 'PUT',
            body: patch,
        }),
        invalidatesTags: (result, error, {id}) => [{ type: 'Colleges', id }, { type: 'Colleges', id: 'LIST' }],
    }),
    deleteCollege: builder.mutation({
        query: (id) => ({
            url: `colleges/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: (result, error, id) => [{ type: 'Colleges', id }, { type: 'Colleges', id: 'LIST' }],
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
    useGetCandidatesQuery,
    useUpdateCandidateMutation,
    useDeleteCandidateMutation,
    useRegisterCandidateMutation,
    useGetAssignmentsForTestQuery,
    useAssignCandidateMutation,
    useUnassignCandidateMutation,
    useGetRolesQuery,
    useCreateRoleMutation,
    useDeleteRoleMutation,
    useGetGovIdTypesQuery,
    useCreateGovIdTypeMutation,
    useDeleteGovIdTypeMutation,
    useGetCollegesQuery,
    useCreateCollegeMutation,
    useUpdateCollegeMutation,
    useDeleteCollegeMutation,
} = api;
