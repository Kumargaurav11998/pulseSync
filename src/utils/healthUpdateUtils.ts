import { AppDispatch } from '../redux/store';
import { setHeartRate, setSpo2, updateSteps, setWeight, setBloodGlucose } from '../redux/healthSlice';
import SQLiteService, { VitalRecord } from '../services/database/SQLiteService';
import { HealthMetric } from '../services/ble/bleDeviceConfig';

export const saveHealthMetric = async (
  dispatch: AppDispatch,
  type: HealthMetric,
  value: number | string,
  unit: string,
  persist: boolean = true
) => {
  const timestamp = new Date().toISOString();

  // 1. Update Redux
  switch (type) {
    case HealthMetric.HEART_RATE:
      dispatch(setHeartRate(Number(value)));
      break;
    case HealthMetric.SPO2:
      dispatch(setSpo2(Number(value)));
      break;
    case HealthMetric.WEIGHT:
      dispatch(setWeight(Number(value)));
      break;
    case HealthMetric.STEPS:
      dispatch(updateSteps(Number(value)));
      break;
    case HealthMetric.BLOOD_GLUCOSE:
      dispatch(setBloodGlucose(Number(value)));
      break;
    // Sleep usually comes as a summary, handle differently if needed
  }

  // 2. Persist to SQLite History
  if (persist) {
    const record: VitalRecord = {
      type,
      value,
      unit,
      timestamp,
    };

    try {
      await SQLiteService.saveVital(record);
    } catch (error) {
      console.error(`Failed to persist ${type} to SQLite:`, error);
    }
  }
};
