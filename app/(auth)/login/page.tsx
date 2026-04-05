'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim()) {
      setError('First name is required');
      return;
    }
    if (!lastName.trim()) {
      setError('Last name is required');
      return;
    }

    const cleaned = phone.replace(/\D/g, '');
    if (!/^5\d{8}$/.test(cleaned)) {
      setError('Enter a valid Georgian phone number (5XX XXX XXX)');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: cleaned }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to send OTP');
        return;
      }

      sessionStorage.setItem('verify_phone', cleaned);
      sessionStorage.setItem('verify_firstName', firstName.trim());
      sessionStorage.setItem('verify_lastName', lastName.trim());
      router.push('/verify');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-black text-black">M</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MarketPoints</h1>
          <p className="text-gray-500 text-sm">Your loyalty cards, one place</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              maxLength={50}
              autoFocus
            />
            <Input
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Phone number
            </label>
            <div className="flex items-center gap-3">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-center shrink-0">
                +995
              </div>
              <Input
                type="tel"
                placeholder="5XX XXX XXX"
                value={phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '');
                  if (digits.length <= 9) {
                    setPhone(formatPhone(digits));
                  }
                }}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            Continue
          </Button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-8">
          We&apos;ll send you a verification code via SMS
        </p>
      </div>
    </div>
  );
}
