import BleManager from 'react-native-ble-manager';
import { getDeviceHandler } from './deviceRegistry';
import { HealthMetric } from './bleDeviceConfig';
import { saveHealthMetric } from '../../utils/healthUpdateUtils';
import { AppDispatch } from '../../redux/store';
import SQLiteService from '../database/SQLiteService';

class BleService {
  private dispatch: AppDispatch | null = null;
  private connectedDevices: Map<string, string> = new Map(); // peripheralId -> deviceName
  private lastWeightTime: number = 0;
  private lastWeightValue: number = 0;
  private weightSaveTimeout: any = null;

  init(dispatch: AppDispatch) {
    this.dispatch = dispatch;
    
    // Start BleManager
    BleManager.start({ showAlert: false })
      .then(() => console.log('BleManager started'))
      .catch((error) => console.error('BleManager start failed', error));

    // Listen for data updates globally
    BleManager.onDidUpdateValueForCharacteristic((data) => {
      this.handleDataUpdate(data);
    });

    // Synchronize latest data from SQLite to Redux
    this.syncDataFromSQLite();
  }

  private async syncDataFromSQLite() {
    if (!this.dispatch) return;
    
    try {
      const metrics = [
        HealthMetric.HEART_RATE,
        HealthMetric.SPO2,
        HealthMetric.WEIGHT,
        HealthMetric.STEPS,
        HealthMetric.BLOOD_GLUCOSE
      ];

      for (const type of metrics) {
        const history = await SQLiteService.getHistory(type, 1);
        if (history.length > 0) {
          const latest = history[0];
          saveHealthMetric(this.dispatch, type, latest.value, latest.unit, false);
        }
      }
      console.log('Successfully synchronized latest metrics from SQLite to Redux');
    } catch (error) {
      console.error('Error synchronizing data from SQLite:', error);
    }
  }

  private handleDataUpdate(data: any) {
    if (!this.dispatch) return;

    const deviceName = this.connectedDevices.get(data.peripheral);
    console.log(`[BLE Data] Peripheral: ${data.peripheral} | Mapped Name: ${deviceName ?? 'NOT FOUND'} | Raw: [${data.value}]`);

    if (!deviceName) return;

    const handler = getDeviceHandler(deviceName);
    if (!handler) {
      console.log(`[BLE Data] No handler found for device: ${deviceName}`);
      return;
    }

    const parsed = handler.parseData(data.value);
    if (!parsed) {
      console.log(`[BLE Data] parseData returned null for ${deviceName} | Raw bytes: [${data.value}]`);
      return;
    }

    if (parsed.type === HealthMetric.WEIGHT) {
      const currentTime = new Date().toLocaleTimeString();
      console.log(`[Weight Received] Value: ${parsed.value} kg | Time: ${currentTime}`);

      // 1. Always update Redux immediately for real-time Dashboard
      saveHealthMetric(this.dispatch, HealthMetric.WEIGHT, parsed.value, parsed.unit, false);

      // 2. Trailing debounce: reset timer on every packet.
      //    Only save to SQLite when scale STOPS sending (2s silence = final stable weight).
      if (this.weightSaveTimeout) clearTimeout(this.weightSaveTimeout);

      this.weightSaveTimeout = setTimeout(() => {
        const finalTime = new Date().toLocaleTimeString();
        saveHealthMetric(this.dispatch!, HealthMetric.WEIGHT, parsed.value, parsed.unit, true);
        console.log(`[Weight Persisted] FINAL: ${parsed.value} kg | Time: ${finalTime}`);
        this.weightSaveTimeout = null;
      }, 2000); // 2 seconds of silence = stable weight

    } else {
      saveHealthMetric(this.dispatch, parsed.type as HealthMetric, parsed.value, parsed.unit);
    }
  }

  async saveDeviceSession(id: string, name: string) {
    try {
      await SQLiteService.saveDevice(id, name);
      this.connectedDevices.set(id, name);
    } catch (error) {
      console.error('Error saving BLE session to SQLite', error);
    }
  }

  /**
   * Attempts to reconnect to all saved devices sequentially
   */
  async autoConnect() {
    try {
      // Ensure BleManager is started (idempotent call)
      await BleManager.start({ showAlert: false });
      
      const savedDevices = await SQLiteService.getDevices();
      
      if (savedDevices.length === 0) {
        console.log('No saved devices to auto-connect');
        return;
      }

      console.log(`Found ${savedDevices.length} saved devices. Starting auto-connect sequence...`);

      for (const device of savedDevices) {
        const { id, name } = device;
        try {
          // Check if already connected first
          const isConnected = await BleManager.isPeripheralConnected(id, []);
          if (isConnected) {
              console.log(`${name} already connected, skipping connect call.`);
              this.connectedDevices.set(id, name);
              continue;
          }

          console.log(`Attempting auto-connect: ${name} (${id})...`);
          await BleManager.connect(id);
          await BleManager.retrieveServices(id);
          
          const handler = getDeviceHandler(name);
          if (handler) {
            await BleManager.startNotification(id, handler.serviceUUID, handler.notifyCharacteristicUUID);
            this.connectedDevices.set(id, name);
            console.log(`Successfully auto-reconnected to ${name}`);
          }
        } catch (err) {
          console.log(`Failed to auto-reconnect to ${name} (${id}):`, err);
        }
      }
    } catch (error) {
      console.warn('Auto-connect initialization failed', error);
    }
  }

  async connectDevice(id: string, name: string) {
    try {
      await BleManager.connect(id);
      await BleManager.retrieveServices(id);
      
      const handler = getDeviceHandler(name);
      if (handler) {
        await BleManager.startNotification(id, handler.serviceUUID, handler.notifyCharacteristicUUID);
        await this.saveDeviceSession(id, name);
        this.connectedDevices.set(id, name);
        return true;
      }
    } catch (error) {
      console.error('Connection failed', error);
    }
    return false;
  }

  getConnectedDevices() {
    return this.connectedDevices;
  }
}

export default new BleService();
