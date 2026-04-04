import { BleDeviceHandler, BleParsedData } from '../bleDeviceConfig';

export const drTrustScaleHandler: BleDeviceHandler = {
  deviceNameMatches: ['SSW526'],
  serviceUUID: 'ffb0',
  notifyCharacteristicUUID: 'ffb2',
  
  parseData: (value: number[]): BleParsedData | null => {
    // Expected Dr Trust payload: e.g. [172, 39, ...]
    // Byte 0 is the header (172)
    // Byte 4 and 5 represent the weight in an unsigned 16-bit big-endian integer
    if (value && value.length >= 6 && value[0] === 172) {
      const rawWeight = (value[4] * 256) + value[5];
      
      // Scale hardware transmits exact raw bytes but the physical screen 
      // rounds it to the nearest 0.05kg (50 grams) natively
      const exactKg = rawWeight / 1000.0;
      const roundedKg = Math.round(exactKg * 20) / 20; 
      
      return {
        type: 'weight',
        value: roundedKg,
        unit: 'kg'
      };
    }
    
    return null;
  }
};
