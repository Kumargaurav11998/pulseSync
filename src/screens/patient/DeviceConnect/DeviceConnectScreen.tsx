import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform, PermissionsAndroid } from 'react-native';
import BleManager, { Peripheral } from 'react-native-ble-manager';
import { styles } from './DeviceConnectScreen.styles';
import { getDeviceHandler } from '../../../services/ble/deviceRegistry';
import { BleParsedData } from '../../../services/ble/bleDeviceConfig';

const DeviceConnectScreen = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [peripherals, setPeripherals] = useState<Map<string, Peripheral>>(new Map());
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [connectedId, setConnectedId] = useState<string | null>(null);
  const [liveData, setLiveData] = useState<BleParsedData | null>(null);
  const connectedDeviceNameRef = useRef<string | null>(null);

  useEffect(() => {
    BleManager.start({ showAlert: false }).catch(err => console.warn(err));

    const discoverListener = BleManager.onDiscoverPeripheral((peripheral: Peripheral) => {
      setPeripherals(prev => {
        const newMap = new Map(prev);
        if (!peripheral.name) {
          peripheral.name = 'Unknown Device';
        }
        newMap.set(peripheral.id, peripheral);
        return newMap;
      });
    });

    const stopListener = BleManager.onStopScan(() => {
      setIsScanning(false);
    });

    const connectListener = BleManager.onConnectPeripheral((data) => {
      console.log('Bluetooth connection established with peripheral:', data.peripheral);
    });

    const disconnectListener = BleManager.onDisconnectPeripheral((data) => {
      console.log('Bluetooth disconnected from peripheral:', data.peripheral);
      setConnectedId(prev => (prev === data.peripheral ? null : prev));
      setLiveData(null);
      connectedDeviceNameRef.current = null;
    });

    const updateValueListener = BleManager.onDidUpdateValueForCharacteristic((data) => {
      // Use ref to break stale closure in useEffect
      const handler = getDeviceHandler(connectedDeviceNameRef.current);
      if (handler) {
        const parsed = handler.parseData(data.value);
        if (parsed) {
          setLiveData(parsed);
        }
      }
    });

    return () => {
      discoverListener.remove();
      stopListener.remove();
      connectListener.remove();
      disconnectListener.remove();
      updateValueListener.remove();
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);
      } else {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      }
    }
  };

  const startScan = async () => {
    if (!isScanning) {
      setPeripherals(new Map());
      await requestPermissions();
      
      try {
        if (Platform.OS === 'android') {
          await BleManager.enableBluetooth();
        }
        await BleManager.scan({ seconds: 5, allowDuplicates: false });
        console.log("Scan started");
        setIsScanning(true);
      } catch (err) {
        console.warn('Scan failed', err);
      }
    }
  };

  const connectToDevice = async (id: string) => {
    try {
      if (isScanning) {
        await BleManager.stopScan();
        setIsScanning(false);
      }
      setConnectingId(id);
      await BleManager.connect(id);
      console.log('Connected to', id);
      
      // Retrieve services before read/write operations as per documentation
      await BleManager.retrieveServices(id);
      console.log('Services retrieved for', id);
      
      const deviceName = peripherals.get(id)?.name;
      const handler = getDeviceHandler(deviceName);
      
      if (handler) {
        await BleManager.startNotification(id, handler.serviceUUID, handler.notifyCharacteristicUUID);
        console.log(`Started listening to ${deviceName} via handler!`);
        connectedDeviceNameRef.current = deviceName ?? null;
      } else {
        console.warn(`Connected to ${id}, but no configured handler found for ${deviceName}.`);
      }
      
      setConnectedId(id);
    } catch (error) {
      console.warn('Connection failed', error);
    } finally {
      setConnectingId(null);
    }
  };

  const devices = Array.from(peripherals.values());

  return (
    <SafeAreaView style={styles.container}>
      {/* TopAppBar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity>
            <Text style={[styles.iconSecondary]}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>PulseSync</Text>
        </View>
        <TouchableOpacity>
          <Text style={[styles.iconPrimary]}>⚙</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Scanning Status Section */}
        <View style={styles.statusSection}>
          <View style={styles.radarContainer}>
            <View style={styles.radarInner}>
              <Text>B</Text>
            </View>
          </View>
          <Text style={styles.statusTitle}>Connected Devices</Text>
          <Text style={styles.statusDesc}>
            <Text>⚫</Text> {isScanning ? 'Scanning for devices...' : 'Tap below to scan'}
          </Text>
          
          <TouchableOpacity style={styles.scanButton} onPress={startScan} disabled={isScanning}>
            <Text>↻</Text>
            <Text style={styles.scanButtonText}>{isScanning ? 'Scanning...' : 'Scan for Devices'}</Text>
          </TouchableOpacity>
        </View>

        {/* Devices List */}
        <View style={styles.devicesList}>
          {devices.map((device) => (
            <View key={device.id} style={styles.deviceCard}>
              <View style={styles.deviceCardLeft}>
                <View style={styles.deviceIconContainer}>
                  <Text>⌚</Text>
                </View>
                <View>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <View style={styles.deviceStatusContainer}>
                    <Text>il</Text>
                    {connectedId === device.id && liveData !== null ? (
                      <Text style={[styles.deviceStatusTextStrong, styles.liveWeightText]}>
                        {liveData.value > 0 
                           ? `${liveData.type.charAt(0).toUpperCase() + liveData.type.slice(1)}: ${liveData.value.toFixed(2)} ${liveData.unit}` 
                           : `Ready to read (0.00 ${liveData.unit})`}
                      </Text>
                    ) : (
                      <Text style={device.rssi > -60 ? styles.deviceStatusTextStrong : styles.deviceStatusTextWeak}>
                        {device.rssi > -60 ? 'Strong Signal' : 'Weak Signal'} (RSSI: {device.rssi})
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              <TouchableOpacity 
                style={connectedId === device.id ? styles.connectButtonSecondary : styles.connectButtonPrimary}
                onPress={() => connectToDevice(device.id)}
                disabled={connectingId === device.id}
              >
                <Text style={connectedId === device.id ? styles.connectButtonTextSecondary : styles.connectButtonTextPrimary}>
                  {connectingId === device.id ? 'Connecting...' : (connectedId === device.id ? 'Connected' : 'Connect')}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
          {devices.length === 0 && !isScanning && (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>No devices found</Text>
          )}
        </View>

        {/* Help Card */}
        <View style={styles.helpCard}>
          <View style={styles.helpIconContainer}>
            <Text>💡</Text>
          </View>
          <Text style={styles.helpTitle}>Can't see your device?</Text>
          <Text style={styles.helpDesc}>
            Ensure your device is in pairing mode and within 1 meter of your phone. Bluetooth must be enabled.
          </Text>
          <TouchableOpacity style={styles.helpLink}>
            <Text style={styles.helpLinkText}>Troubleshoot</Text>
            <Text>{'>'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DeviceConnectScreen;
