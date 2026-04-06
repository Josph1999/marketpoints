import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../lib/api';

interface Props {
  navigation: any;
}

export default function LoginScreen({ navigation }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatPhone = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 9);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  };

  const handleContinue = async () => {
    setError('');
    if (!firstName.trim()) return setError('First name is required');
    if (!lastName.trim()) return setError('Last name is required');

    const cleaned = phone.replace(/\D/g, '');
    if (!/^5\d{8}$/.test(cleaned)) return setError('Enter a valid phone number (5XX XXX XXX)');

    setLoading(true);
    try {
      const res = await api('/api/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber: cleaned }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to send OTP');
        return;
      }
      navigation.navigate('Verify', {
        phone: cleaned,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        {/* Logo — matches Next.js exactly */}
        <View style={styles.logo}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>M</Text>
          </View>
          <Text style={styles.title}>MarketPoints</Text>
          <Text style={styles.subtitle}>Your loyalty cards, one place</Text>
        </View>

        {/* Form — matches Next.js layout */}
        <View style={styles.form}>
          {/* Name row — side by side like Next.js flex gap-3 */}
          <View style={styles.nameRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="First name"
              placeholderTextColor="#6b7280"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              maxLength={50}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Last name"
              placeholderTextColor="#6b7280"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              maxLength={50}
            />
          </View>

          {/* Phone label */}
          <Text style={styles.label}>Phone number</Text>

          {/* Phone row — +995 prefix + input like Next.js */}
          <View style={styles.phoneRow}>
            <View style={styles.prefix}>
              <Text style={styles.prefixText}>+995</Text>
            </View>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="5XX XXX XXX"
              placeholderTextColor="#6b7280"
              value={phone}
              onChangeText={(t) => setPhone(formatPhone(t))}
              keyboardType="phone-pad"
              maxLength={11}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* Button — white bg, black text, rounded-2xl like Next.js */}
          <TouchableOpacity
            style={[styles.button, (loading) && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>We'll send you a verification code via SMS</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },

  // Logo
  logo: { alignItems: 'center', marginBottom: 40 },
  logoBox: {
    width: 80, height: 80, backgroundColor: '#fff', borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', marginBottom: 24,
  },
  logoText: { fontSize: 30, fontWeight: '900', color: '#000' },
  title: { fontSize: 30, fontWeight: '700', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6b7280' },

  // Form
  form: { gap: 16 },
  nameRow: { flexDirection: 'row', gap: 12 },
  label: { fontSize: 14, fontWeight: '500', color: '#9ca3af' },
  phoneRow: { flexDirection: 'row', gap: 12 },
  prefix: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  prefixText: { color: '#fff', fontSize: 16 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 16,
  },
  error: { color: '#f87171', fontSize: 14 },
  button: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#000', fontSize: 18, fontWeight: '600' },
  hint: { color: '#4b5563', fontSize: 12, textAlign: 'center', marginTop: 32 },
});
