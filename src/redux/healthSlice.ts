import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HealthState {
  heartRate: number;
  spo2: number;
  weight: number;
  steps: {
    current: number;
    goal: number;
  };
  sleep: {
    duration: string;
    quality: number;
    status: string;
  };
}

const initialState: HealthState = {
  heartRate: 72,
  spo2: 98,
  weight: 72.5,
  steps: {
    current: 8400,
    goal: 10000,
  },
  sleep: {
    duration: '7h 20m',
    quality: 92,
    status: 'Restorative',
  },
};

export const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    setHeartRate: (state, action: PayloadAction<number>) => {
      state.heartRate = action.payload;
    },
    setSpo2: (state, action: PayloadAction<number>) => {
      state.spo2 = action.payload;
    },
    updateSteps: (state, action: PayloadAction<number>) => {
      state.steps.current = action.payload;
    },
    setWeight: (state, action: PayloadAction<number>) => {
      state.weight = action.payload;
    },
  },
});

export const { setHeartRate, setSpo2, updateSteps, setWeight } = healthSlice.actions;
export default healthSlice.reducer;
