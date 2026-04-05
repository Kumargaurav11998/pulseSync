import { BleDeviceHandler, BleParsedData, HealthMetric } from '../bleDeviceConfig';

export const drTrustScaleHandler: BleDeviceHandler = {
  deviceNameMatches: ['SSW526'],
  serviceUUID: 'ffb0',
  notifyCharacteristicUUID: 'ffb2',
  
  parseData: (value: number[]): BleParsedData | null => {
    // Dr Trust SSW526 payload format: [0xAC, 0x27, 0x00, overflowByte, weightHigh, weightLow, ...]
    // Weight is a 3-byte value: ((overflowByte - 104) * 65536) + (weightHigh * 256) + weightLow
    // Divided by 1000 to get kg. Byte[3]=104 means no overflow (weights < 65.5 kg).
    if (value && value.length >= 6 && value[0] === 172) {
      const rawWeight = ((value[3] - 104) * 65536) + (value[4] * 256) + value[5];

      if (rawWeight <= 0) return null; // Ignore zero/negative reads

      // Round to nearest 0.05 kg (50 grams), matching scale display precision
      const exactKg = rawWeight / 1000.0;
      const roundedKg = Math.round(exactKg * 20) / 20;

      return {
        type: HealthMetric.WEIGHT,
        value: roundedKg,
        unit: 'kg'
      };
    }

    return null;
  }
};
