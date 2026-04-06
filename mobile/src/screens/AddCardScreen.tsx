import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useCardStore } from '../store/useCardStore';
import { CARD_DESIGNS, CARD_MAX_NAME_LENGTH, getCardDesign } from '../types';
import CardGradient from '../components/cards/CardGradient';
import BarcodeDisplay from '../components/cards/BarcodeDisplay';

type Step = 'method' | 'scan' | 'details' | 'preview';

function getNextDesignId(existingCards: { designId: string }[]): string {
  const used = new Set(existingCards.map((c) => c.designId));
  const available = CARD_DESIGNS.find((d) => !used.has(d.id));
  if (available) return available.id;
  return CARD_DESIGNS[0].id;
}

interface Props {
  navigation: any;
}

export default function AddCardScreen({ navigation }: Props) {
  const { createCard, cards } = useCardStore();
  const [step, setStep] = useState<Step>('method');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [designId, setDesignId] = useState(() => getNextDesignId(cards));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const handleScan = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCardNumber(data);
    setStep('details');
  };

  const openScanner = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Camera permission', 'Please allow camera access to scan barcodes.');
        return;
      }
    }
    setScanned(false);
    setStep('scan');
  };

  const handleManualNext = () => {
    setError('');
    if (!cardNumber.trim()) { setError('Please enter a card number'); return; }
    setStep('details');
  };

  const handleDetailsNext = () => {
    setError('');
    if (!cardName.trim()) { setError('Please give your card a name'); return; }
    setStep('preview');
  };

  const handleSave = async () => {
    setLoading(true);
    const result = await createCard({
      cardNumber: cardNumber.trim(),
      name: cardName.trim(),
      designId,
    });
    setLoading(false);
    if (result) navigation.goBack();
  };

  const BackButton = ({ onBack }: { onBack: () => void }) => (
    <TouchableOpacity onPress={onBack} style={styles.backBtn}>
      <Text style={styles.backText}>{'< Back'}</Text>
    </TouchableOpacity>
  );

  // SCAN
  if (step === 'scan') {
    return (
      <View style={styles.scanContainer}>
        <CameraView
          style={StyleSheet.absoluteFill}
          barcodeScannerSettings={{ barcodeTypes: ['code128', 'ean13', 'ean8', 'qr', 'code39'] }}
          onBarcodeScanned={scanned ? undefined : handleScan}
        />
        <SafeAreaView style={styles.scanOverlay}>
          <TouchableOpacity onPress={() => setStep('method')} style={styles.scanClose}>
            <Text style={styles.scanCloseText}>Cancel</Text>
          </TouchableOpacity>
          <View style={styles.scanFrame}>
            <View style={styles.scanCornerTL} />
            <View style={styles.scanCornerTR} />
            <View style={styles.scanCornerBL} />
            <View style={styles.scanCornerBR} />
          </View>
          <Text style={styles.scanHint}>Point at a barcode</Text>
        </SafeAreaView>
      </View>
    );
  }

  // METHOD
  if (step === 'method') {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <BackButton onBack={() => navigation.goBack()} />
          <Text style={styles.title}>Add Card</Text>
          <Text style={styles.subtitle}>How would you like to add your card?</Text>

          <TouchableOpacity style={styles.optionBtn} onPress={openScanner} activeOpacity={0.7}>
            <View style={styles.optionIcon}>
              <Text style={styles.optionIconText}>📷</Text>
            </View>
            <View>
              <Text style={styles.optionTitle}>Scan barcode</Text>
              <Text style={styles.optionDesc}>Use your camera to scan a card</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Enter card number manually"
            placeholderTextColor="#555"
            value={cardNumber}
            onChangeText={setCardNumber}
            autoCapitalize="none"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity
            style={[styles.button, !cardNumber.trim() && styles.buttonDisabled]}
            onPress={handleManualNext}
            disabled={!cardNumber.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // DETAILS
  if (step === 'details') {
    const selectedDesign = getCardDesign(designId);

    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <BackButton onBack={() => setStep('method')} />
          <Text style={styles.title}>Card Details</Text>
          <Text style={styles.subtitle}>Name your card and pick a design</Text>

          <Text style={styles.label}>Card name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Nikora, PSP, My Gym Card..."
            placeholderTextColor="#555"
            value={cardName}
            onChangeText={(t) => t.length <= CARD_MAX_NAME_LENGTH && setCardName(t)}
            maxLength={CARD_MAX_NAME_LENGTH}
          />
          <Text style={styles.charCount}>{cardName.length}/{CARD_MAX_NAME_LENGTH}</Text>

          <Text style={styles.label}>Card design</Text>
          <View style={styles.designGrid}>
            {CARD_DESIGNS.map((d) => (
              <TouchableOpacity
                key={d.id}
                onPress={() => setDesignId(d.id)}
                activeOpacity={0.8}
              >
                <CardGradient design={d} style={{
                  ...styles.designItem,
                  ...(designId === d.id ? styles.designSelected : {}),
                }}>
                  <View style={styles.designInner}>
                    {designId === d.id && <Text style={[styles.checkmark, { color: d.textColor }]}>✓</Text>}
                  </View>
                </CardGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Live preview */}
          <CardGradient design={selectedDesign} style={styles.preview}>
            <View style={styles.previewContent}>
              <Text style={[styles.previewName, { color: selectedDesign.textColor }]}>
                {cardName || 'Card Name'}
              </Text>
              <Text style={[styles.previewNumber, { color: selectedDesign.textColor }]}>
                {cardNumber}
              </Text>
            </View>
          </CardGradient>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity
            style={[styles.button, !cardName.trim() && styles.buttonDisabled]}
            onPress={handleDetailsNext}
            disabled={!cardName.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Preview Barcode</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // PREVIEW
  const finalDesign = getCardDesign(designId);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackButton onBack={() => setStep('details')} />
        <Text style={styles.title}>Preview</Text>
        <Text style={styles.subtitle}>Make sure your barcode looks correct</Text>

        <CardGradient design={finalDesign} style={styles.previewBanner}>
          <View style={styles.previewBannerContent}>
            <Text style={[styles.previewBannerName, { color: finalDesign.textColor }]}>
              {cardName}
            </Text>
            <View style={[styles.previewAvatar, { backgroundColor: finalDesign.accentColor }]}>
              <Text style={[styles.previewAvatarText, { color: finalDesign.textColor }]}>
                {cardName[0]?.toUpperCase()}
              </Text>
            </View>
          </View>
        </CardGradient>

        <View style={styles.barcodeCard}>
          <BarcodeDisplay value={cardNumber} showNumber />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading} activeOpacity={0.8}>
          {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Save Card</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghostBtn} onPress={() => setStep('details')} activeOpacity={0.7}>
          <Text style={styles.ghostBtnText}>Edit details</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const CORNER = { position: 'absolute' as const, width: 24, height: 24, borderColor: '#fff' };

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  content: { paddingHorizontal: 20, paddingBottom: 60 },
  backBtn: { paddingVertical: 16 },
  backText: { color: '#888', fontSize: 16 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#888', fontSize: 14, marginBottom: 24 },
  label: { color: '#888', fontSize: 14, fontWeight: '500', marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, color: '#fff', fontSize: 16,
  },
  charCount: { color: '#555', fontSize: 12, textAlign: 'right', marginTop: 4 },
  error: { color: '#f87171', fontSize: 14, marginTop: 8 },
  button: {
    backgroundColor: '#fff', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 20,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#000', fontSize: 16, fontWeight: '600' },
  ghostBtn: { paddingVertical: 14, alignItems: 'center' },
  ghostBtnText: { color: '#888', fontSize: 16 },

  optionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 20,
  },
  optionIcon: {
    width: 48, height: 48, backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16, justifyContent: 'center', alignItems: 'center',
  },
  optionIconText: { fontSize: 22 },
  optionTitle: { color: '#fff', fontSize: 16, fontWeight: '500' },
  optionDesc: { color: '#888', fontSize: 14 },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  dividerText: { color: '#555', fontSize: 14 },

  designGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  designItem: { width: 72, height: 48, borderRadius: 12 },
  designSelected: { borderWidth: 2, borderColor: '#fff' },
  designInner: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  checkmark: { fontSize: 18, fontWeight: '700' },

  preview: { marginBottom: 8 },
  previewContent: { padding: 20 },
  previewName: { fontSize: 18, fontWeight: '700' },
  previewNumber: { fontSize: 14, fontFamily: 'Courier', marginTop: 8, opacity: 0.8 },

  previewBanner: { marginBottom: 20 },
  previewBannerContent: {
    padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  previewBannerName: { fontSize: 20, fontWeight: '700' },
  previewAvatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  previewAvatarText: { fontSize: 18, fontWeight: '700' },

  barcodeCard: {
    backgroundColor: '#fff', borderRadius: 24, padding: 28, marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },

  // Scanner
  scanContainer: { flex: 1, backgroundColor: '#000' },
  scanOverlay: { flex: 1, justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  scanClose: { alignSelf: 'flex-start', padding: 12 },
  scanCloseText: { color: '#fff', fontSize: 18 },
  scanFrame: { width: 260, height: 160, position: 'relative' },
  scanCornerTL: { ...CORNER, top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 12 },
  scanCornerTR: { ...CORNER, top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 12 },
  scanCornerBL: { ...CORNER, bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 12 },
  scanCornerBR: { ...CORNER, bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 12 },
  scanHint: { color: '#fff', fontSize: 16, marginBottom: 40 },
});
