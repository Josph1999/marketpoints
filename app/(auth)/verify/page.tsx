'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCardStore } from '@/store/useCardStore';
import Button from '@/components/ui/Button';

export default function VerifyPage() {
  const router = useRouter();
  const { setAuth } = useCardStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const storedPhone = sessionStorage.getItem('verify_phone');
    const storedFirst = sessionStorage.getItem('verify_firstName');
    const storedLast = sessionStorage.getItem('verify_lastName');
    if (!storedPhone || !storedFirst || !storedLast) {
      router.replace('/login');
      return;
    }
    setPhone(storedPhone);
    setFirstName(storedFirst);
    setLastName(storedLast);
    inputRefs.current[0]?.focus();
  }, [router]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    if (pasted.length === 6) {
      handleVerify(pasted);
    }
  };

  const handleVerify = async (code: string) => {
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, otp: code, firstName, lastName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid code');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        return;
      }

      setAuth(data.token, {
        phoneNumber: phone,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
      });
      sessionStorage.removeItem('verify_phone');
      sessionStorage.removeItem('verify_firstName');
      sessionStorage.removeItem('verify_lastName');
      router.replace('/');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formattedPhone = phone
    ? `+995 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`
    : '';

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <button
          onClick={() => router.back()}
          className="mb-8 text-gray-500 hover:text-white transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>

        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-white mb-2">Verify your number</h1>
          <p className="text-gray-500 text-sm">
            Enter the code sent to <span className="text-white">{formattedPhone}</span>
          </p>
        </div>

        <div className="flex justify-center gap-3 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        <Button
          onClick={() => handleVerify(otp.join(''))}
          className="w-full"
          size="lg"
          isLoading={isLoading}
          disabled={otp.some((d) => d === '')}
        >
          Verify
        </Button>

        <p className="text-center text-gray-600 text-xs mt-6">
          Didn&apos;t receive the code?{' '}
          <button className="text-gray-400 hover:text-white transition-colors">
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}
