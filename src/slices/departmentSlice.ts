//Загрузка, добавление, удаление
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Employee } from '../types/common';

// Определение базового URL
const API_URL = 'http://localhost:5000/employees';

// Создание асинхронных экшенов
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async () => {
    const response = await axios.get(API_URL);
    return response.data;
  }
);

export const addEmployee = createAsyncThunk(
  'employees/addEmployee',
  async (employee: Employee) => {
    const response = await axios.post(API_URL, employee);
    return response.data;
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async (employee: Employee) => {
    const response = await axios.put(`${API_URL}/${employee.id}`, employee);
    return response.data;
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id: string) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  }
);

// Начальное состояние и редьюсер
const employeeSlice = createSlice({
  name: 'employees',
  initialState: [] as Employee[],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state[index] = action.payload;
        }
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        return state.filter(emp => emp.id !== action.payload);
      });
  },
});

export default employeeSlice.reducer;
