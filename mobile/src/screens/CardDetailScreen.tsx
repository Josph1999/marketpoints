import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Brightness from 'expo-brightness';
import { useCardStore } from '../store/useCardStore';
import { getCardDesign } from '../types';
import CardGradient from '../components/cards/CardGradient';
import BarcodeDisplay from '../components/cards/BarcodeDisplay';

interface Props {
  navigation: any;
  route: any;
}

export default function CardDetailScreen({ navigation, route }: Props) {
  const { cardId } = route.params;
  const { cards, deleteCard } = useCardStore();
  const card = cards.find((c) => c._id === cardId);
  const [origBrightness, setOrigBrightness] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const current = await Brightness.getBrightnessAsync();
        setOrigBrightness(current);
        await Brightness.setBrightnessAsync(1);
      } catch {}
    })();
    return () => {
      if (origBrightness !== null) {
        Brightness.setBrightnessAsync(origBrightness).catch(() => {});
      }
    };
  }, []);

  if (!card) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.notFound}>Card not found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.link}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const design = getCardDesign(card.designId);
  const cardName = card.name || 'Card';

  const handleDelete = () => {
    Alert.alert('Delete card', `Remove "${cardName}" from your wallet?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          await deleteCard(card._id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{'<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <CardGradient design={design} style={styles.banner}>
          <View style={styles.bannerContent}>
            <View style={[styles.avatar, { backgroundColor: design.accentColor }]}>
              <Text style={[styles.avatarText, { color: design.textColor }]}>
                {cardName[0].toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.cardName, { color: design.textColor }]}>{cardName}</Text>
          </View>
        </CardGradient>

        <View style={styles.barcodeCard}>
          <BarcodeDisplay value={card.cardNumber} showNumber />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFound: { color: '#888', fontSize: 16, marginBottom: 12 },
  link: { color: '#fff', textDecorationLine: 'underline' },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 8,
  },
  backBtn: {
    width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20, justifyContent: 'center', alignItems: 'center',
  },
  backText: { color: '#fff', fontSize: 20, fontWeight: '600' },
  deleteBtn: { paddingHorizontal: 16, paddingVertical: 8 },
  deleteText: { color: '#f87171', fontSize: 16 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  banner: { marginBottom: 24 },
  bannerContent: {
    padding: 24, flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  avatar: {
    width: 48, height: 48, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '700' },
  cardName: { fontSize: 24, fontWeight: '700' },
  barcodeCard: {
    backgroundColor: '#fff', borderRadius: 24, padding: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
});
