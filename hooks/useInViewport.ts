import { useEffect, useState, useRef } from 'react';

interface UseInViewportOptions {
  threshold?: number;
  triggerOnce?: boolean;
}

export function useInViewport(options: UseInViewportOptions = {}) {
  const { threshold = 0.2, triggerOnce = true } = options;
  const [isInViewport, setIsInViewport] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // If already triggered and triggerOnce is true, don't observe again
    if (hasTriggered && triggerOnce) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInViewport(true);
            if (triggerOnce) {
              setHasTriggered(true);
            }
          } else if (!triggerOnce) {
            setIsInViewport(false);
          }
        });
      },
      {
        threshold,
        rootMargin: '50px', // Start animation slightly before element is fully visible
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, triggerOnce, hasTriggered]);

  return { elementRef, isInViewport };
}
