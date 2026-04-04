import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import healthReducer from './healthSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    health: healthReducer,
  },
});
