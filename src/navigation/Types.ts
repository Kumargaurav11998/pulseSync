export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type PatientTabParamList = {
  Dashboard: undefined;
  Doctor: undefined;
  Profile: undefined;
};

export type PatientStackParamList = {
  MainTabs: undefined;
  DeviceConnect: undefined;
  HealthDetail: { metricType: string };
  Alerts: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Patient: undefined;
  Splash: undefined;
};
