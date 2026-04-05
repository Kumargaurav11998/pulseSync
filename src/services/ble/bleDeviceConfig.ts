export enum HealthMetric {
  HEART_RATE = 'heart_rate',
  SPO2 = 'spo2',
  WEIGHT = 'weight',
  STEPS = 'steps',
  SLEEP = 'sleep',
  BLOOD_GLUCOSE = 'blood_glucose',
  UNKNOWN = 'unknown'
}

export type BleDeviceType = HealthMetric;

export interface BleParsedData {
  type: BleDeviceType;
  value: number;
  unit: string;
}

export interface BleDeviceHandler {
  /**
   * The list of characteristic names or patterns that match this device
   */
  deviceNameMatches: string[];
  
  /**
   * The primary service UUID to connect and retrieve characteristics from
   */
  serviceUUID: string;
  
  /**
   * The explicit characteristic UUID to start notifications on
   */
  notifyCharacteristicUUID: string;

  /**
   * Parses the raw byte array emitted by this specific device into a standardized format
   */
  parseData: (value: number[]) => BleParsedData | null;
}
