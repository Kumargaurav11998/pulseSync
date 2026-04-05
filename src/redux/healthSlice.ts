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
  bloodGlucose: number;
}

const initialState: HealthState = {
  heartRate: 0,
  spo2: 0,
  weight: 0,
  steps: {
    current: 0,
    goal: 10000,
  },
  sleep: {
    duration: '0h 0m',
    quality: 0,
    status: 'No data',
  },
  bloodGlucose: 0,
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
    setBloodGlucose: (state, action: PayloadAction<number>) => {
      state.bloodGlucose = action.payload;
    },
  },
});

export const { setHeartRate, setSpo2, updateSteps, setWeight, setBloodGlucose } = healthSlice.actions;
export default healthSlice.reducer;
