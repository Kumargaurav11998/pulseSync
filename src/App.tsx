import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen, DeviceConnectScreen } from './screens';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('Splash');

  useEffect(() => {
    if (currentScreen === 'Splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('DeviceConnect');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#006399" />
      {currentScreen === 'Splash' ? (
        <SplashScreen />
      ) : (
        <DeviceConnectScreen />
      )}
    </SafeAreaProvider>
  );
};

export default App;
