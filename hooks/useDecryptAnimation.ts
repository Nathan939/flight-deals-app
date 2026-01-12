import { useState, useEffect, useRef } from 'react';

const SPECIAL_CHARS = '!@#$%^&*()_+-=<>?/{}[]';

interface UseDecryptAnimationOptions {
  duration?: number;
  trigger?: 'mount' | 'hover' | 'viewport';
  isInViewport?: boolean;
}

export function useDecryptAnimation(
  value: string,
  options: UseDecryptAnimationOptions = {}
) {
  const { duration = 800, trigger = 'viewport', isInViewport = false } = options;
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const animationRef = useRef<number | null>(null);

  const startAnimation = () => {
    if (isAnimating || hasAnimated) return;

    setIsAnimating(true);
    setHasAnimated(true);
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress < 1) {
        // Create a decrypted version based on progress
        const decryptedValue = value
          .split('')
          .map((char, index) => {
            // Calculate when this character should reveal (staggered effect)
            const charProgress = Math.max(0, (progress - index * 0.05) * 1.2);

            if (charProgress >= 0.9) {
              // Character is fully revealed
              return char;
            } else if (charProgress > 0.1) {
              // Character is transitioning - show random special chars
              const randomChar = SPECIAL_CHARS[Math.floor(Math.random() * SPECIAL_CHARS.length)];
              // Only replace digits and some letters, keep spaces and special formatting
              if (/[0-9a-zA-Z]/.test(char)) {
                return randomChar;
              }
              return char;
            } else {
              // Character hasn't started revealing yet
              if (/[0-9a-zA-Z]/.test(char)) {
                return SPECIAL_CHARS[Math.floor(Math.random() * SPECIAL_CHARS.length)];
              }
              return char;
            }
          })
          .join('');

        setDisplayValue(decryptedValue);
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        setDisplayValue(value);
        setIsAnimating(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (trigger === 'mount') {
      // Small delay to ensure the component is mounted
      const timeout = setTimeout(() => {
        startAnimation();
      }, 50);
      return () => clearTimeout(timeout);
    }

    if (trigger === 'viewport' && isInViewport && !hasAnimated) {
      // Start animation when element enters viewport
      const timeout = setTimeout(() => {
        startAnimation();
      }, 100);
      return () => clearTimeout(timeout);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, trigger, isInViewport, hasAnimated]);

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      startAnimation();
    }
  };

  return {
    displayValue,
    isAnimating,
    handleMouseEnter,
  };
}
