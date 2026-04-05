import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useStepCounter } from '../hooks/useStepCounter';
import { useSleepTracker } from '../hooks/useSleepTracker';
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
import { Icon } from '../components';

const Tab = createBottomTabNavigator<PatientTabParamList>();
const Stack = createNativeStackNavigator<PatientStackParamList>();

const getTabBarIcon = (route: any) => ({ color, size }: { color: string; size: number }) => {
  let iconName = 'view-dashboard';
  if (route.name === 'Dashboard') {
    iconName = 'view-dashboard';
  } else if (route.name === 'Doctor') {
    iconName = 'doctor';
  } else if (route.name === 'Profile') {
    iconName = 'account';
  }
  return <Icon name={iconName} size={size} color={color} />;
};

const TabNavigator = () => {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
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
        },
        tabBarIcon: getTabBarIcon(route),
      })}
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
  useStepCounter();
  useSleepTracker();

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
