import { useEffect, useCallback } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { updateSleep } from '../redux/healthSlice';
import SleepBridge, { SleepSegment } from '../services/sleep/SleepBridge';
import SQLiteService from '../services/database/SQLiteService';
import { HealthMetric } from '../services/ble/bleDeviceConfig';

/**
 * Hook to manage Android Sleep API.
 * 1. Initializes tracking on app launch.
 * 2. Processes "offline" data gathered while app was closed.
 * 3. Listens for real-time updates if they occur while app is foregrounded.
 */
export const useSleepTracker = () => {
  const dispatch = useAppDispatch();

  const refreshSleepUI = useCallback(async () => {
    const totalMins = await SQLiteService.getTodayTotal(HealthMetric.SLEEP);
    const hours = Math.floor(totalMins / 60);
    const minutes = Math.floor(totalMins % 60);
    const durationStr = `${hours}h ${minutes}m`;

    const sleepData = {
      duration: durationStr,
      quality: 100, // Fixed quality for now as Google Sleep API doesn't provide 0-100 score directly
      status: totalMins > 0 ? 'Completed' : 'No data',
    };

    dispatch(updateSleep(sleepData));
    console.log(`[SleepTracker] UI Updated from SQLite: ${durationStr}`);
  }, [dispatch]);

  const processSegments = useCallback(async (segments: SleepSegment[]) => {
    if (segments.length === 0) return;

    console.log(`[SleepTracker] Processing ${segments.length} sleep segments...`);
    let sessionMinutes = 0;

    for (const segment of segments) {
      if (segment.status === 0) {
        const diffMs = segment.endTimeMillis - segment.startTimeMillis;
        const diffMins = Math.floor(diffMs / 60000);
        sessionMinutes += diffMins;
      }
    }

    if (sessionMinutes > 0) {
      // 1. Persist this session's minutes to SQLite
      try {
        await SQLiteService.saveVital({
          type: HealthMetric.SLEEP,
          value: sessionMinutes,
          unit: 'minutes',
          timestamp: new Date().toISOString(),
        });
        console.log(`[SleepTracker] Recorded ${sessionMinutes} minutes session to SQLite`);
      } catch (e) {
        console.warn('[SleepTracker] SQLite Save Failed:', e);
      }

      // 2. Refresh UI with NEW total (including this session)
      await refreshSleepUI();
    }
  }, [refreshSleepUI]);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initSleepTracker = async () => {
      console.log('[SleepTracker] Initializing Sleep API...');
      
      // 1. Load existing data for today from SQLite to populate UI immediately
      await refreshSleepUI();

      // 2. Request Permission
      const granted = await SleepBridge.requestPermission();
      if (!granted) {
          console.warn('[SleepTracker] Permission denied');
          return;
      }

      // 3. Start Tracking (Survives app kill)
      const success = await SleepBridge.startTracking();
      if (success) {
          console.log('[SleepTracker] Tracking active');
      }

      // 4. Process any catch-up data (this will save values + refresh UI)
      const unprocessed = await SleepBridge.fetchUnprocessedSleepData();
      if (unprocessed.length > 0) {
          console.log('[SleepTracker] Found unprocessed offline data');
          await processSegments(unprocessed);
      } else {
          console.log('[SleepTracker] No offline data to catch up');
      }

      // 5. Set up real-time listener (this will save values + refresh UI)
      unsubscribe = SleepBridge.onSleepUpdate((segments) => {
          console.log('[SleepTracker] Received real-time update from Native!');
          processSegments(segments);
      });
    };

    initSleepTracker();
    
    return () => {
      unsubscribe?.();
    };
  }, [processSegments, refreshSleepUI]);
};
