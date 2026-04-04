import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import healthReducer from './healthSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    health: healthReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {auth: AuthState, health: HealthState}
export type AppDispatch = typeof store.dispatch;
