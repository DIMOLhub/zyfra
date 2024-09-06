import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const departmentApi = createApi({
  reducerPath: 'departmentApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: () => '/employees',
    }),
    getDepartments: builder.query({
      query: () => '/departments',
    }),
    addDepartment: builder.mutation({
      query: (department) => ({
        url: '/departments',
        method: 'POST',
        body: department,
      }),
    }),
    updateDepartment: builder.mutation({
      query: (department) => ({
        url: `/departments/${department.id}`,
        method: 'PUT',
        body: department,
      }),
    }),
    deleteDepartment: builder.mutation({
      query: (id) => ({
        url: `/departments/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetDepartmentsQuery,
  useAddDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentApi;