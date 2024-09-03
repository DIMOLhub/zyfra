//конфигурироваться хранилище
import { configureStore } from "@reduxjs/toolkit";
import { departmentApi } from "../services/departmentApi";
import { employeeApi } from "../services/employeeApi";

export const store = configureStore({
  reducer: {
    [employeeApi.reducerPath]: employeeApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer,

    // departments: departmentsReducer,
    // employees: employeesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(employeeApi.middleware, departmentApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

// Store (store/index.ts): Вся логика по управлению состоянием приложения сосредоточена в Redux-хранилище.
// Здесь настройки хранилищя и два слайса: departmentsSlice и employeesSlice.