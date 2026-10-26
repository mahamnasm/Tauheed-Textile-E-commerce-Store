'use client';

import { useEffect } from 'react';
import { initOneSignal } from '@/lib/onesignal';

export default function OneSignalInit() {
  useEffect(() => {
    // Delay init so it doesn't block page render
    const timer = setTimeout(() => initOneSignal(), 3000);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
