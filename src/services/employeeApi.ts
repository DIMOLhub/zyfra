import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Employee, ID } from '../types/common.ts';

export const employeeApi = createApi({
  reducerPath: 'employeeApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/' }),
  tagTypes: ['Employee'],
  endpoints: (builder) => ({
    fetchEmployees: builder.query<Employee[], null>({
      query: () => '/employees',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Employee' as const, id })),
              { type: 'Employee' as const, id: 'LIST' },
            ]
          : [{ type: 'Employee' as const, id: 'LIST' }],
    }),
    fetchEmployeeById: builder.query<Employee, ID>({
      query: (id) => `/employees/${id}`,
      providesTags: (result, error, id) => [{ type: 'Employee', id }],
    }),
    addEmployee: builder.mutation<Employee, Employee>({
      query: (employee) => ({
        url: '/employees',
        method: 'POST',
        body: employee,
      }),
      invalidatesTags: [{ type: 'Employee' as const, id: 'LIST' }],
    }),
    updateEmployee: builder.mutation<Employee, Employee>({
      query: (employee) => ({
        url: `/employees/${employee.id}`,
        method: 'PUT',
        body: employee,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Employee' as const, id }],
    }),
    deleteEmployeeById: builder.mutation<void, ID>({
      query: (id) => ({
        url: `/employees/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Employee' as const, id }],
    }),
  }),
});

export const { 
  useFetchEmployeesQuery, 
  useAddEmployeeMutation, 
  useFetchEmployeeByIdQuery, 
  useDeleteEmployeeByIdMutation, 
  useUpdateEmployeeMutation
} = employeeApi;