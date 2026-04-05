import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppDispatch } from '../redux/hooks';
import { updateSteps } from '../redux/healthSlice';
import StepCounterBridge from '../services/stepCounter/StepCounterBridge';
import SQLiteService from '../services/database/SQLiteService';
import { HealthMetric } from '../services/ble/bleDeviceConfig';

/**
 * useStepCounter
 *
 * Manages the full step counter lifecycle:
 * - Requests permission on first use
 * - Starts/stops sensor based on AppState (foreground/background)
 * - Reads persisted steps immediately on launch (even after app was killed)
 * - Listens to real-time sensor events while in foreground
 * - Dispatches step count updates to Redux
 * - Persists daily steps to SQLite for history
 *
 * Mount this hook once in AppNavigator (not per-screen).
 */
export const useStepCounter = () => {
  const dispatch = useAppDispatch();
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const lastPersistedStepsRef = useRef<number>(-1);

  const persistToSQLite = async (steps: number) => {
    // Avoid redundant writes – only persist if changed by ≥1 step
    if (steps === lastPersistedStepsRef.current) return;
    lastPersistedStepsRef.current = steps;

    try {
      await SQLiteService.saveVital({
        type: HealthMetric.STEPS,
        value: steps,
        unit: 'steps',
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      // Non-critical – don't crash
    }
  };

  const handleStepUpdate = (steps: number) => {
    console.log(`[StepCounter] Real-time steps updated: ${steps}`);
    dispatch(updateSteps(steps));
    persistToSQLite(steps);
  };

  const startListening = () => {
    StepCounterBridge.start();
    unsubscribeRef.current = StepCounterBridge.onStepUpdate(handleStepUpdate);
  };

  const stopListening = () => {
    StepCounterBridge.stop();
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
  };

  useEffect(() => {
    const initStepCounter = async () => {
      const supported = await StepCounterBridge.isSupported();
      if (!supported) return;

      // Request permission (Android 10+)
      const granted = await StepCounterBridge.requestPermission();
      if (!granted) return;

      // Immediately load persisted steps from SharedPreferences.
      // This populates the UI instantly even if the app was killed —
      // the hardware chip counted all steps and we persisted the last value.
      const savedSteps = await StepCounterBridge.getTodaySteps();
      console.log(`[StepCounter] Initial load from SharedPreferences: ${savedSteps} steps`);
      dispatch(updateSteps(savedSteps));

      // Start real-time listener
      startListening();
    };

    initStepCounter();

    // Handle AppState transitions
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        // App came to foreground: reload persisted steps first, then re-listen
        StepCounterBridge.getTodaySteps().then(steps => {
          dispatch(updateSteps(steps));
        });
        startListening();
      } else if (nextState === 'background' || nextState === 'inactive') {
        // App going to background: stop listener (saves battery)
        // Hardware chip keeps counting silently
        stopListening();
      }
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      stopListening();
      appStateSubscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
