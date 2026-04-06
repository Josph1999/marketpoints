import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useCardStore } from '../store/useCardStore';
import CardItem from '../components/cards/CardItem';

interface Props {
  navigation: any;
}

export default function HomeScreen({ navigation }: Props) {
  const { cards, isLoading, user, fetchCards } = useCardStore();
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header — matches Next.js */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, {user?.firstName}</Text>
          <Text style={styles.count}>
            {cards.length} {cards.length === 1 ? 'card' : 'cards'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('Add Card')}
          activeOpacity={0.8}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={2.5}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </Svg>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      ) : cards.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth={1.5}>
              <Path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </Svg>
          </View>
          <Text style={styles.emptyTitle}>No Cards Yet</Text>
          <Text style={styles.emptyDesc}>Add your first loyalty card to get started</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {/* Stack/Expand toggle — matches Next.js */}
          <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.toggleBtn}>
            <Text style={styles.toggleText}>
              {isExpanded ? 'Stack cards' : 'Expand cards'}
            </Text>
          </TouchableOpacity>

          {cards.map((card) => (
            <CardItem
              key={card._id}
              card={card}
              onPress={() => navigation.navigate('CardDetail', { cardId: card._id })}
            />
          ))}
        </ScrollView>
      )}

      {/* FAB — matches Next.js */}
      {cards.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('Add Card')}
          activeOpacity={0.8}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={2.5}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </Svg>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  greeting: { color: '#6b7280', fontSize: 14 },
  count: { color: '#fff', fontSize: 24, fontWeight: '700' },
  addBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Empty state — matches Next.js
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: { color: '#fff', fontSize: 20, fontWeight: '600', marginBottom: 8 },
  emptyDesc: { color: '#6b7280', fontSize: 14, textAlign: 'center' },

  // Card list
  list: { paddingTop: 8, paddingBottom: 100 },
  toggleBtn: { paddingHorizontal: 16, marginBottom: 16 },
  toggleText: { color: '#6b7280', fontSize: 12 },

  // FAB — matches Next.js
  fab: {
    position: 'absolute',
    bottom: 96,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 40,
  },
});
