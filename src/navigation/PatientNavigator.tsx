import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PatientStackParamList, PatientTabParamList } from './Types';
import { 
  DashboardScreen, 
  DeviceConnectScreen, 
  HealthDetailScreen, 
  AlertsScreen, 
  ProfileScreen,
  DoctorScreen
} from '../screens';
import { colors } from '../theme';

const Tab = createBottomTabNavigator<PatientTabParamList>();
const Stack = createNativeStackNavigator<PatientStackParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60,
          paddingVertical: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        }
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Doctor" 
        component={DoctorScreen} 
        options={{ title: 'Doctor' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const PatientNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="DeviceConnect" component={DeviceConnectScreen} />
      <Stack.Screen name="HealthDetail" component={HealthDetailScreen} />
      <Stack.Screen name="Alerts" component={AlertsScreen} />
    </Stack.Navigator>
  );
};

export default PatientNavigator;
