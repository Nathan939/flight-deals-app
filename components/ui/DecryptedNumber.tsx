'use client';

import { useDecryptAnimation } from '@/hooks/useDecryptAnimation';

interface DecryptedNumberProps {
  value: string | number;
  className?: string;
  duration?: number;
  trigger?: 'mount' | 'hover' | 'viewport';
  isInViewport?: boolean;
}

export default function DecryptedNumber({
  value,
  className = '',
  duration = 800,
  trigger = 'viewport',
  isInViewport = false,
}: DecryptedNumberProps) {
  const stringValue = String(value);
  const { displayValue, handleMouseEnter } = useDecryptAnimation(stringValue, {
    duration,
    trigger,
    isInViewport,
  });

  return (
    <span
      className={`font-mono ${className}`}
      onMouseEnter={handleMouseEnter}
      style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
    >
      {displayValue}
    </span>
  );
}
