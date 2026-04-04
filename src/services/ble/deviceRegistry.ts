import { BleDeviceHandler } from './bleDeviceConfig';
import { drTrustScaleHandler } from './devices/DrTrustWeightScale';

// Register all supported devices here
const supportedDevices: BleDeviceHandler[] = [
  drTrustScaleHandler,
];

/**
 * Finds a matching device handler based on the advertised device name.
 * @param deviceName The advertised name of the Bluetooth peripheral
 * @returns The appropriate BleDeviceHandler or null if not supported
 */
export const getDeviceHandler = (deviceName?: string | null): BleDeviceHandler | null => {
  if (!deviceName) return null;
  
  for (const handler of supportedDevices) {
    if (handler.deviceNameMatches.some(match => deviceName.includes(match))) {
      return handler;
    }
  }
  
  return null;
};
