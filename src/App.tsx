import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { SplashScreen, DashboardScreen, DeviceConnectScreen } from './screens';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('Splash');

  useEffect(() => {
    if (currentScreen === 'Splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('Dashboard');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Splash':
        return <SplashScreen />;
      case 'Dashboard':
        return <DashboardScreen />;
      case 'DeviceConnect':
        return <DeviceConnectScreen />;
      default:
        return <SplashScreen />;
    }
  };

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#f7f9fb" />
        {renderScreen()}
      </SafeAreaProvider>
    </Provider>
  );
};
export default App;
