import React, { useState } from 'react';
import { View, Text, Modal, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import healthApi from '../config/healthApi';
import { colors, spacing, radius, text, shadow } from '../styles/theme';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export default function AuthModal({ visible, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isLogin ? '/login/' : '/signup/';
      const payload = isLogin 
        ? { username: email, password }
        : { email, password, username: name };

      const response = await healthApi.post(endpoint, payload);
      console.log('Auth response:', response);
      
      if (response.data?.token || response.data?.access || response.data?.key) {
        let token = response.data.token || response.data.access || response.data.key;
        console.log('Token received:', token);
        
        // If token is an object, extract the access token
        if (typeof token === 'object' && token.access) {
          token = token.access;
          console.log('Extracted access token:', token);
        }
        
        await healthApi.setAuthToken(token);
        
        // Verify token was stored
        const storedToken = await healthApi.getAuthToken();
        console.log('Token stored:', storedToken);
        
        Alert.alert('Success', isLogin ? 'Logged in successfully!' : 'Account created successfully!');
        onAuthSuccess();
        onClose();
        // Reset form
        setEmail('');
        setPassword('');
        setName('');
      } else {
        console.log('No token in response:', response.data);
        Alert.alert('Error', 'Authentication failed - no token received');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      let message = 'Authentication failed';
      
      if (error.message) {
        const errorMsg = error.message;
        if (errorMsg.includes('username already exists')) {
          message = 'This username is already taken. Please try logging in instead.';
        } else if (errorMsg.includes('username') && errorMsg.includes('required')) {
          message = 'Username is required';
        } else if (errorMsg.includes('Invalid Credentials') || errorMsg.includes('Invalid credentials') || errorMsg.includes('401')) {
          message = 'Invalid username or password. Please check your credentials and try again.';
        } else {
          message = errorMsg;
        }
      }
      
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalCard, shadow.card]}>
          <Text style={styles.modalTitle}>
            {isLogin ? 'Login Required' : 'Create Account'}
          </Text>
          <Text style={styles.modalSubtitle}>
            {isLogin 
              ? 'Please login to register for campaigns' 
              : 'Create an account to register for campaigns'
            }
          </Text>

          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder={isLogin ? "Email (used as username)" : "Email"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={styles.modalRow}>
            <Pressable 
              onPress={onClose} 
              style={({ pressed }) => [styles.btn, styles.btnGhost, { opacity: pressed ? 0.92 : 1 }]}
            >
              <Text style={styles.btnGhostText}>Cancel</Text>
            </Pressable>
            
            <Pressable 
              onPress={handleAuth} 
              disabled={loading}
              style={({ pressed }) => [
                styles.btn, 
                styles.btnPrimary, 
                { opacity: pressed || loading ? 0.92 : 1 }
              ]}
            >
              <Text style={styles.btnPrimaryText}>
                {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
              </Text>
            </Pressable>
          </View>

          <Pressable onPress={switchMode} style={styles.switchButton}>
            <Text style={styles.switchText}>
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Login"
              }
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: { 
    ...text.title,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalSubtitle: { 
    marginBottom: spacing.lg, 
    color: colors.textMuted,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    fontSize: 16,
    backgroundColor: colors.surface,
  },
  modalRow: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    gap: spacing.sm, 
    marginTop: spacing.md 
  },
  btn: { 
    paddingVertical: spacing.sm, 
    paddingHorizontal: spacing.lg, 
    borderRadius: radius.md,
    flex: 1,
  },
  btnPrimary: { backgroundColor: colors.primary },
  btnPrimaryText: { 
    color: colors.buttonTextOnPrimary, 
    fontWeight: '700',
    textAlign: 'center',
  },
  btnGhost: { backgroundColor: colors.primarySoft },
  btnGhostText: { 
    color: colors.text, 
    fontWeight: '700',
    textAlign: 'center',
  },
  switchButton: {
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  switchText: {
    color: colors.primary,
    textAlign: 'center',
    fontSize: 14,
  },
});
