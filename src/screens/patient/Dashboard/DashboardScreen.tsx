import React, { useEffect, useState } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { AppText, Card, Header, Icon } from '../../../components';
import { styles } from './DashboardScreen.styles';
import { colors } from '../../../theme';
import { useAppSelector } from '../../../redux/hooks';

import { PULSE_DATA, DASHBOARD_STRINGS } from './Dashboard.constants';

import { useNavigation, NavigationProp } from '@react-navigation/native';
import { PatientStackParamList } from '../../../navigation/Types';
import StepCounterCard from '../../../components/Dashboard/StepCounterCard';
import SyncDeviceCard from '../../../components/Dashboard/SyncDeviceCard';
import WeeklyInsights from '../../../components/Dashboard/WeeklyInsights';
import SQLiteService, { VitalRecord } from '../../../services/database/SQLiteService';
import { HealthMetric } from '../../../services/ble/bleDeviceConfig';

const DashboardScreen = () => {
  const navigation = useNavigation<NavigationProp<PatientStackParamList>>();
  const { heartRate, spo2, weight, steps, sleep } = useAppSelector((state) => state.health);
  const user = useAppSelector((state) => state.auth.user);
  const [weightHistory, setWeightHistory] = useState<any[]>([]);
  const [weightTrend, setWeightTrend] = useState<string | null>(null);

  useEffect(() => {
    fetchWeightHistory();
  }, [weight]); // Refresh when current weight updates

  const fetchWeightHistory = async () => {
    try {
      const history = await SQLiteService.getHistory(HealthMetric.WEIGHT, 7);
      if (history.length > 0) {
        
        // Calculate weight trend if we have at least 2 records from different days
        if (history.length >= 2) {
          const latestRecord = history[0];
          const oldestRecord = history[history.length - 1];
          const latestDate = new Date(latestRecord.timestamp).toDateString();
          const oldestDate = new Date(oldestRecord.timestamp).toDateString();
          
          if (latestDate !== oldestDate) {
            const diff = Number(latestRecord.value) - Number(oldestRecord.value);
            let trendIcon = diff > 0 ? '↑' : diff < 0 ? '↓' : '→';
            let trendText = `${trendIcon} ${diff > 0 ? '+' : ''}${diff.toFixed(1)} kg this week`;
            setWeightTrend(trendText);
          } else {
            setWeightTrend(null);
          }
        } else {
          setWeightTrend(null);
        }

        // Transform for LineChart (oldest to newest)
        const chartData = [...history].reverse().map((record: VitalRecord) => {
          return {
            value: Number(record.value),
          };
        });
        setWeightHistory(chartData);
      }
    } catch (error) {
      console.error('Error fetching weight history:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 17) return 'Good Afternoon,';
    if (hour < 21) return 'Good Evening,';
    return 'Good Night,';
  };

  const getCurrentDate = () => {
    const d = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="h2" style={styles.greetingHeader}>
          {getGreeting()} <AppText variant="h2" bold>{user?.displayName?.split(' ')[0] || 'User'}</AppText>
        </AppText>
        <AppText variant="subtext" style={styles.dateText}>
          {getCurrentDate()}
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
              hideDataPoints={true}
              hideRules={true}
              hideYAxisText={true}
              hideAxesAndRules={true}
              curved={true}
              areaChart={true}
              focusEnabled={false}
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
                <Icon name="scale-bathroom" size={24} color={colors.primary} />
              </View>
              <View style={styles.weightTitleContainer}>
                <AppText variant="headline" style={styles.cardTitle}>{DASHBOARD_STRINGS.WEIGHT}</AppText>
                {weightTrend && (
                   <View style={styles.weightTrendPill}>
                      <AppText variant="tiny" style={styles.weightTrendText}>{weightTrend}</AppText>
                   </View>
                )}
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
                  data={weightHistory.length > 0 ? weightHistory : [{value: 0}, {value: 0}]}
                  height={60}
                  width={150}
                  initialSpacing={0}
                  color={colors.primary}
                  thickness={3}
                  hideDataPoints={true}
                  hideRules={true}
                  hideYAxisText={true}
                  hideAxesAndRules={true}
                  curved={true}
                  areaChart={true}
                  focusEnabled={false}
                  startFillColor={colors.primary}
                  endFillColor={colors.background}
                  startOpacity={0.1}
                  endOpacity={0}
               />
            </View>
          </View>
        </Card>

        {/* Steps Card */}
        <StepCounterCard currentSteps={steps.current} goalSteps={steps.goal} />

        {/* Weekly Insights / Quotes Carousel */}
        <WeeklyInsights />

        {/* New Sync Device Card */}
        <SyncDeviceCard 
          onPress={() => navigation.navigate('DeviceConnect')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;


