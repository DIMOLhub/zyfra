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
  useUpdateEmployeeMutation // Добавили экспорт для обновления
} = employeeApi;


// export { Employee };
// import { createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { Employee } from '../types/common';


// export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
//   const response = await axios.get('http://localhost:5000/employees');
//   return response.data;
// });

// export const addEmployee = createAsyncThunk('employees/addEmployee', async (employee: Employee) => {
//   const response = await axios.post('http://localhost:5000/employees', employee);
//   return response.data;
// });

// export const updateEmployee = createAsyncThunk('employees/updateEmployee', async (employee: Employee) => {
//   const response = await axios.put(`http://localhost:5000/employees/${employee.id}`, employee);
//   return response.data;
// });

// export const deleteEmployee = createAsyncThunk('employees/deleteEmployee', async (id: number) => {
//   await axios.delete(`http://localhost:5000/employees/${id}`);
//   return id;
// });