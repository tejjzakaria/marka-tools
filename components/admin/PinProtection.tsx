/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { IconLock, IconShieldCheck, IconAlertCircle } from '@tabler/icons-react';

interface PinProtectionProps {
  onAuthenticated: (pin: string) => Promise<boolean>;
}

export default function PinProtection({ onAuthenticated }: PinProtectionProps) {
  const t = useTranslations('admin.pin');
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newPin.every((digit) => digit !== '') && index === 5) {
      verifyPin(newPin.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const newPin = pastedData.split('');
      setPin(newPin);
      verifyPin(pastedData);
    }
  };

  const verifyPin = async (pinValue: string) => {
    setIsLoading(true);
    setError('');

    try {
      const success = await onAuthenticated(pinValue);

      if (!success) {
        setError(t('invalid'));
        setPin(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError(t('connectionError'));
      setPin(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconLock size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">{t('title')}</h1>
          <p className="text-neutral-600">{t('subtitle')}</p>
        </div>

        <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isLoading}
              className={`w-12 h-14 text-center text-xl font-semibold border-2 rounded-lg transition-all
                ${error ? 'border-error' : 'border-neutral-200'}
                ${digit ? 'border-primary bg-primary/5' : ''}
                focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
                disabled:opacity-50 disabled:cursor-not-allowed`}
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center justify-center gap-2 text-error mb-4">
            <IconAlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-primary mb-4">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">{t('verifying')}</span>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-neutral-500 text-sm mt-6">
          <IconShieldCheck size={18} />
          <span>{t('secureAuth')}</span>
        </div>
      </div>
    </div>
  );
}
