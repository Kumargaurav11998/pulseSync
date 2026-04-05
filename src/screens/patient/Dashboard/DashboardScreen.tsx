import React, { useEffect, useState } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { AppText, Card, Header } from '../../../components';
import { styles } from './DashboardScreen.styles';
import { colors } from '../../../theme';
import { useAppSelector } from '../../../redux/hooks';

import { PULSE_DATA, DASHBOARD_STRINGS } from './Dashboard.constants';

import { useNavigation, NavigationProp } from '@react-navigation/native';
import { PatientStackParamList } from '../../../navigation/Types';
import StepCounterCard from '../../../components/Dashboard/StepCounterCard';
import SyncDeviceCard from '../../../components/Dashboard/SyncDeviceCard';
import SQLiteService, { VitalRecord } from '../../../services/database/SQLiteService';
import { HealthMetric } from '../../../services/ble/bleDeviceConfig';

const DashboardScreen = () => {
  const navigation = useNavigation<NavigationProp<PatientStackParamList>>();
  const { heartRate, spo2, weight, steps, sleep } = useAppSelector((state) => state.health);
  const user = useAppSelector((state) => state.auth.user);
  const [weightHistory, setWeightHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchWeightHistory();
  }, [weight]); // Refresh when current weight updates

  const fetchWeightHistory = async () => {
    try {
      const history = await SQLiteService.getHistory(HealthMetric.WEIGHT, 7);
      if (history.length > 0) {
        const today = new Date().toDateString();
        // Transform for LineChart (oldest to newest)
        const chartData = history.reverse().map((record: VitalRecord) => {
          const date = new Date(record.timestamp);
          const isToday = date.toDateString() === today;
          
          return {
            value: Number(record.value),
            label: isToday 
              ? `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
              : date.getDate().toString(),
          };
        });
        setWeightHistory(chartData);
      }
    } catch (error) {
      console.error('Error fetching weight history:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="h2" style={styles.greetingHeader}>
          {DASHBOARD_STRINGS.GREETING} <AppText variant="h2" bold>{user?.name || 'User'}</AppText>
        </AppText>
        <AppText variant="subtext" style={styles.dateText}>
          Sunday, April 5
        </AppText>

        {/* Heart Rate Card */}
        <Card style={styles.heartRateCard}>
          <View style={styles.cardHeader}>
            <AppText variant="headline" style={styles.cardTitle}>{DASHBOARD_STRINGS.HEART_RATE}</AppText>
            <View style={styles.liveIndicator} />
          </View>
          <View style={styles.vitalValueContainer}>
            <AppText style={styles.vitalValue} variant="h1" bold>{heartRate || '--'}</AppText>
            <AppText variant="caption" style={styles.vitalUnit}>BPM</AppText>
          </View>
          
          <View style={styles.chartContainer}>
            <LineChart
              data={PULSE_DATA}
              height={80}
              width={300}
              initialSpacing={0}
              color1={colors.primary}
              thickness={3}
              hideDataPoints
              hideRules
              hideYAxisText
              hideAxesAndRules
              curved
              areaChart
              startOpacity={0.2}
              endOpacity={0}
              color={colors.primary}
              startFillColor={colors.primary}
              endFillColor={colors.secondary}
            />
          </View>
          <View style={styles.cardFooter}>
             <AppText variant="tiny" style={styles.syncStatus}>{DASHBOARD_STRINGS.LIVE_SYNCING}</AppText>
             <AppText variant="tiny" style={styles.updateTime}>{DASHBOARD_STRINGS.UPDATED_TIME}</AppText>
          </View>
        </Card>

        <View style={styles.row}>
          {/* SpO2 Card */}
          <Card style={[styles.halfCard, styles.spO2Card]}>
            <AppText variant="headline" style={styles.cardTitle}>{DASHBOARD_STRINGS.SPO2}</AppText>
            <View style={styles.vitalValueContainer}>
              <AppText variant="h2" bold>{spo2 || '--'}</AppText>
              <AppText variant="caption" style={styles.vitalUnit}>%</AppText>
            </View>
            <AppText variant="tiny" style={styles.statusText}>{DASHBOARD_STRINGS.NORMAL_RANGE}</AppText>
          </Card>

          {/* Sleep Card */}
          <Card style={[styles.halfCard, styles.sleepCardSmall]}>
            <AppText variant="headline" style={styles.cardTitle}>{DASHBOARD_STRINGS.SLEEP}</AppText>
            <View style={styles.vitalValueContainer}>
              <AppText variant="h2" bold>{sleep.duration === '0h 0m' ? '--' : sleep.duration.split(' ')[0]}</AppText>
              <AppText variant="caption" style={styles.vitalUnit}>{sleep.duration === '0h 0m' ? '' : `h ${sleep.duration.split(' ')[1]}`}</AppText>
            </View>
            <AppText variant="tiny" style={styles.statusText}>{sleep.status}</AppText>
          </Card>
        </View>

        {/* Weight Card (Refactored to match screenshot) */}
        <Card style={styles.weightCardFull}>
          <View style={styles.weightHeader}>
             <View style={styles.weightIconContainer}>
                <AppText style={styles.weightIconText}>⚖</AppText>
             </View>
             <View style={styles.weightTitleContainer}>
                <AppText variant="headline" style={styles.cardTitle}>{DASHBOARD_STRINGS.WEIGHT}</AppText>
                <View style={styles.weightTrendPill}>
                   <AppText variant="tiny" style={styles.weightTrendText}>{DASHBOARD_STRINGS.WEIGHT_TREND}</AppText>
                </View>
             </View>
          </View>

          <View style={styles.weightBody}>
            <View>
               <View style={styles.vitalValueContainer}>
                  <AppText variant="h2" bold>{weight || '--'}</AppText>
                  <AppText variant="caption" style={styles.vitalUnit}>kg</AppText>
               </View>
               <AppText variant="tiny" style={styles.lastDaysText}>{DASHBOARD_STRINGS.LAST_7_DAYS}</AppText>
            </View>
            
            <View style={styles.weightChartContainer}>
               <LineChart
                  data={weightHistory.length > 0 ? weightHistory : [{value: 0, label: ''}, {value: 0, label: ''}]}
                  height={60}
                  width={150}
                  initialSpacing={0}
                  color={colors.secondary}
                  thickness={3}
                  hideDataPoints
                  hideRules
                  hideYAxisText
                  hideAxesAndRules
                  curved
                  areaChart
                  startFillColor={colors.secondary}
                  endFillColor={colors.background}
                  startOpacity={0.1}
                  endOpacity={0}
               />
            </View>
          </View>
        </Card>

        {/* Steps Card */}
        <StepCounterCard currentSteps={steps.current} goalSteps={steps.goal} />

        {/* New Sync Device Card */}
        <SyncDeviceCard 
          onPress={() => navigation.navigate('DeviceConnect')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;


