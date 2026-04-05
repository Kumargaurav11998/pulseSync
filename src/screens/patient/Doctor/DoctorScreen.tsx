import React from 'react';
import { View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { AppText, Header, Card } from '../../../components';
import { styles } from './DoctorScreen.styles';

const DoctorScreen = () => {
  const doctors = [
    { id: 1, name: 'Dr. Sarah Wilson', specialty: 'Cardiologist', status: 'Available' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'General Practitioner', status: 'In Consultation' },
    { id: 3, name: 'Dr. Elena Rodriguez', specialty: 'Nutritionist', status: 'Available' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <AppText style={styles.title}>Your Doctors</AppText>
        <AppText style={styles.subtitle}>Connect with your healthcare team instantly.</AppText>

        {doctors.map((doctor) => (
          <View key={doctor.id} style={styles.doctorCard}>
            <View style={styles.avatarContainer}>
               <AppText style={styles.avatarText}>{doctor.name.charAt(4)}</AppText>
            </View>
            <View style={styles.doctorInfo}>
              <AppText variant="body" bold style={styles.doctorName}>{doctor.name}</AppText>
              <AppText style={styles.specialty}>{doctor.specialty}</AppText>
              <View style={[
                styles.statusBadge, 
                doctor.status === 'Available' ? styles.successBadge : styles.errorBadge
              ]}>
                 <AppText style={[
                   styles.statusText, 
                   doctor.status === 'Available' ? styles.successText : styles.errorText
                 ]}>{doctor.status}</AppText>
              </View>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <AppText style={styles.actionButtonText}>Book</AppText>
            </TouchableOpacity>
          </View>
        ))}
        
        <Card style={styles.emergencyCard}>
           <AppText variant="h3" style={styles.emergencyTitle}>Need immediate help?</AppText>
           <AppText style={styles.emergencyText}>Our emergency response team is available 24/7 for critical heart rate alerts.</AppText>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DoctorScreen;
