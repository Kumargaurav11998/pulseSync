/**
 * StepCounterBridge.ts
 *
 * TypeScript bridge over the native StepCounterModule.
 *
 * How it works (no notification, no persistent service):
 * ─────────────────────────────────────────────────────
 * Android's TYPE_STEP_COUNTER is a HARDWARE chip inside the phone.
 * It counts steps 24/7 — foreground, background, AND when the app is killed.
 * We only need to:
 *   1. Start a sensor listener (for real-time in-app updates)
 *   2. Store a daily offset (SharedPreferences, survives app kill)
 *   3. Read today_steps = hardwareTotal - offset on each launch
 *
 * No notification is shown to the user.
 */

import {
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
} from 'react-native';

const { StepCounterModule } = NativeModules;

type StepUpdateListener = (steps: number) => void;

class StepCounterBridge {
  private emitter: NativeEventEmitter | null = null;
  private subscription: any = null;

  /** Request ACTIVITY_RECOGNITION permission (required on Android 10+) */
  async requestPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
        {
          title: 'Step Counter Permission',
          message:
            'PulseSync needs access to your activity data to count your steps accurately.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  }

  /** Check if the device has a hardware step counter sensor */
  async isSupported(): Promise<boolean> {
    if (!StepCounterModule || Platform.OS !== 'android') return false;
    try {
      return await StepCounterModule.isSupported();
    } catch {
      return false;
    }
  }

  /**
   * Start the sensor listener.
   * Call this on app foreground / component mount.
   * The hardware chip keeps counting even when we're not listening.
   */
  start(): void {
    if (!StepCounterModule || Platform.OS !== 'android') return;
    StepCounterModule.startCounting();
  }

  /**
   * Stop the sensor listener.
   * Call this on app background / component unmount.
   * Steps are still counted by the hardware chip.
   */
  stop(): void {
    if (!StepCounterModule || Platform.OS !== 'android') return;
    StepCounterModule.stopCounting();
  }

  /**
   * Get today's persisted step count from SharedPreferences.
   * Works immediately on app launch even after app was killed — because
   * the hardware chip counted all steps and we persisted them last time.
   */
  async getTodaySteps(): Promise<number> {
    if (!StepCounterModule || Platform.OS !== 'android') return 0;
    try {
      const steps = await StepCounterModule.getTodaySteps();
      return Math.max(0, Math.round(steps));
    } catch {
      return 0;
    }
  }

  /**
   * Listen for real-time step count updates while app is in foreground.
   * Returns an unsubscribe function.
   */
  onStepUpdate(listener: StepUpdateListener): () => void {
    if (!StepCounterModule || Platform.OS !== 'android') return () => {};

    if (!this.emitter) {
      this.emitter = new NativeEventEmitter(StepCounterModule);
    }

    this.subscription = this.emitter.addListener('StepCountUpdate', (steps: number) => {
      listener(Math.max(0, Math.round(steps)));
    });

    return () => {
      this.subscription?.remove();
      this.subscription = null;
    };
  }

  /** Remove all active step update listeners */
  removeAllListeners(): void {
    this.subscription?.remove();
    this.subscription = null;
  }
}

export default new StepCounterBridge();
