import { NativeModules, Platform, PermissionsAndroid, NativeEventEmitter } from 'react-native';

const { SleepModule } = NativeModules;

export interface SleepSegment {
  startTimeMillis: number;
  endTimeMillis: number;
  status: number;
}

class SleepBridge {
  private emitter: NativeEventEmitter | null = null;
  private subscription: any = null;
  
  /** 
   * Request ACTIVITY_RECOGNITION permission (required on Android 10+).
   * Note: This is the same permission used for step counting.
   */
  async requestPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') return false;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
        {
          title: 'Sleep Tracking Permission',
          message:
            'PulseSync needs access to your activity data to accurately track your sleep in the background.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  }

  /**
   * Subscribes the app to the Google Play Services Sleep API.
   * This uses a PendingIntent, which means tracking survives app termination.
   */
  async startTracking(): Promise<boolean> {
    if (!SleepModule || Platform.OS !== 'android') return false;
    try {
      return await SleepModule.startSleepTracking();
    } catch (e) {
      console.warn("Failed to start sleep tracking: ", e);
      return false;
    }
  }

  /**
   * Unsubscribes from the Sleep API.
   */
  async stopTracking(): Promise<boolean> {
    if (!SleepModule || Platform.OS !== 'android') return false;
    try {
      return await SleepModule.stopSleepTracking();
    } catch (e) {
      console.warn("Failed to stop sleep tracking: ", e);
      return false;
    }
  }

  /**
   * Reads any un-saved sleep segments that were caught while the app was offline.
   * Calling this perfectly flushes the native queue.
   */
  async fetchUnprocessedSleepData(): Promise<SleepSegment[]> {
    if (!SleepModule || Platform.OS !== 'android') return [];
    try {
      const jsonStr = await SleepModule.fetchUnprocessedSleepData();
      return JSON.parse(jsonStr) as SleepSegment[];
    } catch (e) {
      console.warn("Failed to fetch sleep data: ", e);
      return [];
    }
  }

  /**
   * Listen for real-time sleep updates while the app is in the foreground.
   */
  onSleepUpdate(listener: (segments: SleepSegment[]) => void): () => void {
    if (!SleepModule || Platform.OS !== 'android') return () => {};

    if (!this.emitter) {
        this.emitter = new NativeEventEmitter(SleepModule);
    }

    this.subscription = this.emitter.addListener('SleepDataUpdate', (jsonStr: string) => {
        try {
            const segments = JSON.parse(jsonStr) as SleepSegment[];
            listener(segments);
        } catch (e) {
            console.error('[SleepBridge] Failed to parse sleep update:', e);
        }
    });

    return () => {
        this.subscription?.remove();
        this.subscription = null;
    };
  }
}

export default new SleepBridge();
