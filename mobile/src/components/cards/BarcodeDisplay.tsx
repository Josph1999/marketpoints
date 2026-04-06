import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

let Barcode: any = null;
try {
  Barcode = require('react-native-barcode-builder').default;
} catch {
  // not available on web
}

interface BarcodeDisplayProps {
  value: string;
  showNumber?: boolean;
}

function sanitize(value: string): string {
  return value.replace(/[^\x00-\x7F]/g, '');
}

function formatCardNumber(num: string): string {
  return num.replace(/(.{4})/g, '$1 ').trim();
}

export default function BarcodeDisplay({ value, showNumber = true }: BarcodeDisplayProps) {
  const clean = sanitize(value);

  return (
    <View style={styles.container}>
      <View style={styles.barcodeBox}>
        {clean && Barcode ? (
          <Barcode value={clean} format="CODE128" width={2} height={80} background="#ffffff" lineColor="#000000" />
        ) : clean ? (
          <View style={styles.fallback}>
            <Text style={styles.fallbackBars}>||||||||||||||||||||||||</Text>
            <Text style={styles.fallbackText}>{clean}</Text>
          </View>
        ) : (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>Enter a valid card number</Text>
          </View>
        )}
      </View>
      {showNumber && (
        <Text style={styles.number}>{formatCardNumber(value)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  barcodeBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  errorBox: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
  fallback: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackBars: {
    fontSize: 40,
    letterSpacing: -2,
    color: '#000',
    fontWeight: '100',
  },
  fallbackText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontFamily: 'Courier',
  },
  number: {
    fontSize: 24,
    fontFamily: 'Courier',
    fontWeight: '700',
    letterSpacing: 2,
    color: '#000',
    textAlign: 'center',
  },
});
