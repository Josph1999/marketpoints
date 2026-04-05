'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCardStore } from '@/store/useCardStore';
import { CARD_DESIGNS, CARD_MAX_NAME_LENGTH, CardDesignId, getCardDesign } from '@/types';
import CardScanner from '@/components/scanner/CardScanner';
import CardPattern from '@/components/cards/CardPattern';
import BarcodeDisplay from '@/components/cards/BarcodeDisplay';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type Step = 'method' | 'scan' | 'details' | 'preview';

function getNextDesignId(existingCards: { designId: string }[]): CardDesignId {
  const usedIds = new Set(existingCards.map((c) => c.designId));
  const available = CARD_DESIGNS.find((d) => !usedIds.has(d.id));
  if (available) return available.id as CardDesignId;
  // All used — pick the least-used one
  const counts = new Map<string, number>();
  for (const c of existingCards) {
    counts.set(c.designId, (counts.get(c.designId) || 0) + 1);
  }
  let minCount = Infinity;
  let minId = CARD_DESIGNS[0].id;
  for (const d of CARD_DESIGNS) {
    const count = counts.get(d.id) || 0;
    if (count < minCount) {
      minCount = count;
      minId = d.id;
    }
  }
  return minId as CardDesignId;
}

export default function AddCardPage() {
  const router = useRouter();
  const { createCard, cards } = useCardStore();
  const [step, setStep] = useState<Step>('method');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [designId, setDesignId] = useState<CardDesignId>(() => getNextDesignId(cards));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = useCallback((value: string) => {
    setCardNumber(value);
    setStep('details');
  }, []);

  const handleManualNext = () => {
    setError('');
    if (!cardNumber.trim()) {
      setError('Please enter a card number');
      return;
    }
    setStep('details');
  };

  const handleDetailsNext = () => {
    setError('');
    if (!cardName.trim()) {
      setError('Please give your card a name');
      return;
    }
    if (cardName.length > CARD_MAX_NAME_LENGTH) {
      setError(`Card name must be ${CARD_MAX_NAME_LENGTH} characters or less`);
      return;
    }
    setStep('preview');
  };

  const handleSave = async () => {
    setIsLoading(true);
    const result = await createCard({
      cardNumber: cardNumber.trim(),
      name: cardName.trim(),
      designId,
    });
    setIsLoading(false);
    if (result) {
      router.replace('/');
    }
  };

  const BackButton = ({ onBack }: { onBack: () => void }) => (
    <button
      onClick={onBack}
      className="mb-6 text-gray-500 hover:text-white transition-colors flex items-center gap-2"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
      Back
    </button>
  );

  // Step 1: Choose method
  if (step === 'method') {
    return (
      <div className="min-h-screen px-6 pt-14">
        <BackButton onBack={() => router.back()} />
        <h1 className="text-2xl font-bold text-white mb-2">Add Card</h1>
        <p className="text-gray-500 text-sm mb-8">How would you like to add your card?</p>

        <div className="space-y-3 mb-8">
          <button
            onClick={() => setStep('scan')}
            className="w-full flex items-center gap-4 p-5 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors"
          >
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Scan barcode</p>
              <p className="text-gray-500 text-sm">Use your camera to scan a card</p>
            </div>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-black px-4 text-gray-600 text-sm">or</span>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              placeholder="Enter card number manually"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              error={error}
            />
            <Button
              onClick={handleManualNext}
              className="w-full"
              size="lg"
              disabled={!cardNumber.trim()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step: Scanner
  if (step === 'scan') {
    return <CardScanner onScan={handleScan} onClose={() => setStep('method')} />;
  }

  // Step: Card details (name + design)
  if (step === 'details') {
    const selectedDesign = getCardDesign(designId);

    return (
      <div className="min-h-screen px-6 pt-14 pb-8">
        <BackButton onBack={() => setStep('method')} />
        <h1 className="text-2xl font-bold text-white mb-2">Card Details</h1>
        <p className="text-gray-500 text-sm mb-8">Name your card and pick a design</p>

        <div className="space-y-6">
          <div>
            <Input
              label="Card name"
              placeholder="e.g. Nikora, PSP, My Gym Card..."
              value={cardName}
              onChange={(e) => {
                if (e.target.value.length <= CARD_MAX_NAME_LENGTH) {
                  setCardName(e.target.value);
                }
              }}
              maxLength={CARD_MAX_NAME_LENGTH}
              error={error}
              autoFocus
            />
            <p className="text-right text-gray-600 text-xs mt-1">
              {cardName.length}/{CARD_MAX_NAME_LENGTH}
            </p>
          </div>

          {/* Design picker */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">
              Card design
            </label>
            <div className="grid grid-cols-4 gap-3">
              {CARD_DESIGNS.map((design) => (
                <button
                  key={design.id}
                  onClick={() => setDesignId(design.id as CardDesignId)}
                  className={`aspect-[3/2] rounded-xl relative overflow-hidden transition-all ${
                    designId === design.id
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-105'
                      : 'hover:scale-105'
                  }`}
                  style={{ background: design.background }}
                >
                  <CardPattern design={design} />
                  {designId === design.id && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={design.textColor} strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Live preview card */}
          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{ background: selectedDesign.background }}
          >
            <CardPattern design={selectedDesign} />
            <div className="relative z-10">
              <p className="font-bold text-lg" style={{ color: selectedDesign.textColor }}>
                {cardName || 'Card Name'}
              </p>
              <p className="font-mono text-sm mt-2" style={{ color: selectedDesign.textColor, opacity: 0.8 }}>
                {cardNumber}
              </p>
            </div>
          </div>

          <Button onClick={handleDetailsNext} className="w-full" size="lg" disabled={!cardName.trim()}>
            Preview Barcode
          </Button>
        </div>
      </div>
    );
  }

  // Step: Preview barcode
  const finalDesign = getCardDesign(designId);

  return (
    <div className="min-h-screen px-6 pt-14 flex flex-col">
      <BackButton onBack={() => setStep('details')} />
      <h1 className="text-2xl font-bold text-white mb-2">Preview</h1>
      <p className="text-gray-500 text-sm mb-8">Make sure your barcode looks correct</p>

      <div
        className="rounded-3xl p-6 mb-6 relative overflow-hidden"
        style={{ background: finalDesign.background }}
      >
        <CardPattern design={finalDesign} />
        <div className="relative z-10 flex items-center justify-between">
          <h3 className="text-xl font-bold" style={{ color: finalDesign.textColor }}>
            {cardName}
          </h3>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: finalDesign.accentColor }}
          >
            <span className="font-bold" style={{ color: finalDesign.textColor }}>
              {cardName[0]?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 mb-8">
        <BarcodeDisplay
          value={cardNumber}
          format="CODE128"
          showNumber={true}
          size="lg"
        />
      </div>

      <div className="mt-auto pb-8 space-y-3">
        <Button onClick={handleSave} className="w-full" size="lg" isLoading={isLoading}>
          Save Card
        </Button>
        <Button onClick={() => setStep('details')} variant="ghost" className="w-full" size="md">
          Edit details
        </Button>
      </div>
    </div>
  );
}
