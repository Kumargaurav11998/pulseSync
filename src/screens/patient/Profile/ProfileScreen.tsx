import React, { useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppText, Header, Card } from '../../../components';
import { spacing, colors } from '../../../theme';
import { styles } from './ProfileScreen.styles';

interface UserProfile {
  displayName: string;
  email: string;
  photoURL?: string;
}

const ProfileScreen = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem('@user_profile');
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        }
      } catch (error) {
        console.error('Error fetching profile', error);
      }
    };
    fetchProfile();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <AppText style={styles.avatarLargeText}>
              {profile ? getInitials(profile.displayName) : 'PS'}
            </AppText>
          </View>
          <AppText variant="h2" bold style={styles.userName}>
            {profile?.displayName || 'PulseSync User'}
          </AppText>
          <AppText variant="subtext" style={styles.userEmail}>
            {profile?.email || 'user@example.com'}
          </AppText>
        </View>

        <Card style={styles.infoCard}>
          <AppText variant="body" bold style={{ marginBottom: spacing.m }}>Health ID</AppText>
          <AppText variant="h3" style={{ color: colors.primary }}>#PS-9823-110</AppText>
        </Card>

        <View style={styles.section}>
          <AppText variant="headline" style={styles.sectionTitle}>Account Settings</AppText>
          
          <TouchableOpacity style={styles.menuItem}>
            <AppText>Personal Information</AppText>
            <AppText variant="subtext">→</AppText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <AppText>Security & Privacy</AppText>
            <AppText variant="subtext">→</AppText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <AppText>Data & Syncing</AppText>
            <AppText variant="subtext">→</AppText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <AppText>Device Management</AppText>
            <AppText variant="subtext">→</AppText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <AppText style={styles.logoutText}>Logout</AppText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
