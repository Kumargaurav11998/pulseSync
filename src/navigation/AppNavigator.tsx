import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { RootStackParamList } from './Types';
import AuthNavigator from './AuthNavigator';
import PatientNavigator from './PatientNavigator';
import { SplashScreen } from '../screens';

import { useAppDispatch } from '../redux/hooks';
import BleService from '../services/ble/BleService';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const dispatch = useAppDispatch();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  // Handle user state changes
  function onAuthStateChanged(firebaseUser: FirebaseAuthTypes.User | null) {
    setUser(firebaseUser);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Initialize BLE Service and Auto-Connect when user is authenticated
  useEffect(() => {
    if (!initializing && user) {
      BleService.init(dispatch);
      BleService.autoConnect();
    }
  }, [initializing, user, dispatch]);

  if (initializing) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Patient" component={PatientNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
