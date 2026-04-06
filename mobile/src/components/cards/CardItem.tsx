import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getCardDesign, Card } from '../../types';
import CardGradient from './CardGradient';

interface CardItemProps {
  card: Card;
  onPress: () => void;
}

function formatCardNumber(num: string): string {
  return num.replace(/(.{4})/g, '$1 ').trim();
}

export default function CardItem({ card, onPress }: CardItemProps) {
  const design = getCardDesign(card.designId);
  const cardName = card.name || 'Card';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <CardGradient design={design} style={styles.card}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.name, { color: design.textColor }]} numberOfLines={1}>
              {cardName}
            </Text>
            <View style={[styles.avatar, { backgroundColor: design.accentColor }]}>
              <Text style={[styles.avatarText, { color: design.textColor }]}>
                {cardName[0].toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={[styles.number, { color: design.textColor }]} numberOfLines={1}>
            {formatCardNumber(card.cardNumber)}
          </Text>
        </View>
      </CardGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  content: {
    padding: 24,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  number: {
    fontSize: 18,
    fontFamily: 'Courier',
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 16,
    opacity: 0.85,
  },
});
