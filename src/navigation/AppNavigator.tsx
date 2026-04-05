import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import { RootStackParamList } from './Types';
import AuthNavigator from './AuthNavigator';
import PatientNavigator from './PatientNavigator';
import { SplashScreen } from '../screens';
import QuoteService from '../services/quotes/QuoteService';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import BleService from '../services/ble/BleService';
import SQLiteService from '../services/database/SQLiteService';
import { setUser as setReduxUser } from '../redux/authSlice';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  
  // Use Redux user as the source of truth for navigation
  const user = useAppSelector(state => state.auth.user);

  useEffect(() => {
    let unsubscribe: () => void;

    const initAuth = async () => {
      try {
        // Fetch and cache quotes for insights carousel
        QuoteService.fetchAndStoreQuotes();

        // 1. Try to load user from SQLite for immediate state
        const savedUser = await SQLiteService.getUser();
        if (savedUser && !user) {
          dispatch(setReduxUser(savedUser));
        }
      } catch (error) {
        console.error("Error loading saved user from SQLite", error);
      } finally {
        // 2. Subscribe to Firebase Auth changes
        unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
          if (firebaseUser) {
            // Sync Firebase user with SQLite and Redux
            const userData = {
               uid: firebaseUser.uid,
               displayName: firebaseUser.displayName,
               email: firebaseUser.email,
               photoURL: firebaseUser.photoURL,
               lastLogin: new Date().toISOString()
            };
            await SQLiteService.saveUser(userData);
            dispatch(setReduxUser(userData));
          }
          setLoading(false);
        });
      }
    };

    initAuth();
    return () => {
      if (unsubscribe) unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]); // Removed 'user' to prevent infinite loop

  // Initialize BLE Service and Auto-Connect when user is authenticated
  useEffect(() => {
    if (!loading && user) {
      BleService.init(dispatch);
      BleService.autoConnect();
    }
  }, [loading, user, dispatch]);

  if (loading && !user) {
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
