"use client";

import { useEffect } from 'react';

const PWARegister = () => {
  useEffect(() => {
    // Service Worker'ı kaydet
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // PWA install prompt için event listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // Bu event'i global olarak sakla (usePWA hook'unda kullanılacak)
      (window as any).deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return null; // Bu komponent görsel olarak hiçbir şey render etmez
};

export default PWARegister;
