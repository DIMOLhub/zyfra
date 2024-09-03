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
        url: `/departments/${department.id}`, // Исправление: добавлены обратные кавычки
        method: 'PUT',
        body: department,
      }),
    }),
    deleteDepartment: builder.mutation({
      query: (id) => ({
        url: `/departments/${id}`, // Исправление: добавлены обратные кавычки
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


// Слайсы (slices/departmentsSlice.ts, slices/employeesSlice.ts):
// Описание логики загрузки данных с сервера, а также действие по добавлению, обновлению и удалению записей.

// //Загрузка, добавление, удаление
// import { createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { Department } from '../types/common';

// export const fetchDepartments = createAsyncThunk('departments/fetchDepartments', async () => {
//   const response = await axios.get('http://localhost:5000/departments');
//   return response.data;
// });

// export const addDepartment = createAsyncThunk('departments/addDepartment', async (department: Department) => {
//   const response = await axios.post('http://localhost:5000/departments', department);
//   return response.data;
// });

// export const updateDepartment = createAsyncThunk('departments/updateDepartment', async (department: Department) => {
//   const response = await axios.put(`http://localhost:5000/departments/${department.id}`, department);
//   return response.data;
// });

// export const deleteDepartment = createAsyncThunk('departments/deleteDepartment', async (id: number) => {
//   await axios.delete(`http://localhost:5000/departments/${id}`);
//   return id;
// });


// function createApi(arg0: { reducerPath: string; baseQuery: any; endpoints: (builder: any) => { getEmployeeById: any; }; }) {
//   throw new Error('Function not implemented.');
// }

// function fetchBaseQuery(arg0: { baseUrl: string; }): any {
//   throw new Error('Function not implemented.');
// }