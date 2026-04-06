import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCardStore } from '../store/useCardStore';

export default function SettingsScreen() {
  const { user, cards, logout } = useCardStore();

  const formatted = user?.phoneNumber
    ? `+995 ${user.phoneNumber.slice(0, 3)} ${user.phoneNumber.slice(3, 6)} ${user.phoneNumber.slice(6)}`
    : '';

  const handleLogout = () => {
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>Settings</Text>

      {/* Account section — matches Next.js */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowPrimary}>{user?.firstName} {user?.lastName}</Text>
            <Text style={styles.rowSecondary}>{formatted}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.rowBetween}>
            <Text style={styles.rowPrimary}>Cards saved</Text>
            <Text style={styles.rowSecondary}>{cards.length}</Text>
          </View>
        </View>
      </View>

      {/* About section — matches Next.js */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowPrimary}>MarketPoints</Text>
            <Text style={styles.rowSecondary}>Version 1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.aboutText}>
              Your loyalty cards, all in one place. Never fumble at checkout again.
            </Text>
          </View>
        </View>
      </View>

      {/* Sign out — matches Next.js red border button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
        <Text style={styles.logoutText}>Sign out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000', paddingHorizontal: 24 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginTop: 16, marginBottom: 32 },

  section: { marginBottom: 32 },
  sectionTitle: {
    color: '#6b7280', fontSize: 12, fontWeight: '600',
    letterSpacing: 1, marginBottom: 12,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: { padding: 16 },
  rowBetween: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  rowPrimary: { color: '#fff', fontSize: 14, fontWeight: '500' },
  rowSecondary: { color: '#6b7280', fontSize: 14, marginTop: 2 },
  aboutText: { color: '#9ca3af', fontSize: 14, lineHeight: 20 },

  logoutBtn: {
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: { color: '#f87171', fontSize: 16, fontWeight: '500' },
});
