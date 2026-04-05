import React, { useEffect } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { styles } from './SplashScreen.styles';
import SQLiteService from '../services/database/SQLiteService';

const SplashScreen = () => {
  useEffect(() => {
    SQLiteService.initDB().catch(err => {
      console.error('Failed to initialize SQLite on Splash:', err);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo Placeholder */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>PulseSync</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>PulseSync</Text>
        <Text style={styles.subtitle}>THE CLINICAL SANCTUARY</Text>

        {/* Loading Indicator */}
        <View style={styles.loaderContainer}>
          <View style={styles.loaderBar}>
            <View style={styles.loaderFill} />
          </View>
          <Text style={styles.loaderText}>INITIALIZING SECURE SYNC</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
