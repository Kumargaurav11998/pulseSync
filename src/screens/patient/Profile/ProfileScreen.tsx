import { View, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { AppText, Header, Card } from '../../../components';
import { spacing, colors } from '../../../theme';
import { styles } from './ProfileScreen.styles';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { logout } from '../../../redux/authSlice';
import SQLiteService from '../../../services/database/SQLiteService';
import auth from '@react-native-firebase/auth';


const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const getInitials = (name: string | null) => {
    if (!name) return 'PS';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            try {
              // Sign out from Firebase
              await auth().signOut();
              
              // Clear SQLite
              await SQLiteService.clearUserData();
              
              // Update Redux
              dispatch(logout());
              
              console.log("Logged out successfully");
            } catch (error) {
              console.error("Logout error", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <AppText style={styles.avatarLargeText}>
              {user ? getInitials(user.displayName) : 'PS'}
            </AppText>
          </View>
          <AppText variant="h2" bold style={styles.userName}>
            {user?.displayName || 'PulseSync User'}
          </AppText>
          <AppText variant="subtext" style={styles.userEmail}>
            {user?.email || 'user@example.com'}
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

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <AppText style={styles.logoutText}>Logout</AppText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
