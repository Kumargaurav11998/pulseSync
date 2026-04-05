import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { styles } from './LoginScreen.styles';
import { AppText, Button } from '../../../components';
import AuthInput from '../../../components/common/AuthInput';
import { colors } from '../../../theme';
import SQLiteService from '../../../services/database/SQLiteService';
import { useAppDispatch } from '../../../redux/hooks';
import { setUser } from '../../../redux/authSlice';

const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Configure Google Sign-In with Web Client ID
    GoogleSignin.configure({
      webClientId: '333584005924-isq6mmaincl1hesik7du40gq9rd026h6.apps.googleusercontent.com',
    });
  }, []);

  const saveUserData = async (user: any) => {
    try {
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString(),
      };
      
      // Save to SQLite
      await SQLiteService.saveUser(userData);
      
      // Update Redux state
      dispatch(setUser(userData));
      
      console.log('User data saved to SQLite and Redux');
    } catch (error) {
      console.error('Error saving user data', error);
    }
  };

  const onGoogleButtonPress = async () => {
    try {
      setLoading(true);
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the users ID token
      const signInResult = await GoogleSignin.signIn();
      
      // Get the ID token from the result
      const idToken = signInResult.data?.idToken;
      if (!idToken) {
        throw new Error('No ID token found');
      }

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      // Save data locally for quick access
      await saveUserData(userCredential.user);

    } catch (error: any) {
      console.error(error);
      Alert.alert('Google Sign-In Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    // Standard Firebase Email/Password login can be implemented here later
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Sign In', 'Email/Password login currently uses Google Sign-In only.');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header/Logo Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <AppText bold variant="h2" style={{ color: colors.textInverse }}>PS</AppText>
          </View>
          <AppText bold variant="h2" style={styles.title}>Welcome Back</AppText>
          <AppText variant="body" style={styles.subtitle}>
            Sign in to continue monitoring your health sync
          </AppText>
        </View>

        {/* Login Form Section */}
        <View style={styles.formSection}>
          <AuthInput
            label="Email Address"
            placeholder="example@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          
          <AuthInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightIcon={
              <AppText variant="tiny" style={{ color: colors.primary }}>
                {showPassword ? 'HIDE' : 'SHOW'}
              </AppText>
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <AppText variant="subtext" style={styles.forgotPasswordText}>
              Forgot Password?
            </AppText>
          </TouchableOpacity>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />
        </View>

        {/* Social Authentication Section */}
        <View style={styles.dividerSection}>
          <View style={styles.divider} />
          <AppText variant="tiny" style={styles.dividerText}>OR CONTINUE WITH</AppText>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialSection}>
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={onGoogleButtonPress}
            disabled={loading}
          >
            <AppText bold variant="body">Google</AppText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.socialButton}
            disabled={loading}
          >
            <AppText bold variant="body">Apple</AppText>
          </TouchableOpacity>
        </View>

        {/* Footer/Sign Up Section */}
        <View style={styles.footerSection}>
          <AppText variant="body">Don't have an account?</AppText>
          <TouchableOpacity 
            style={styles.signUpLink}
            onPress={() => Alert.alert('Action', 'Navigate to Register Screen')}
          >
            <AppText bold variant="body" style={styles.signUpText}>
              Sign Up
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
