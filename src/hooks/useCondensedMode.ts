import { useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';

export const useCondensedMode = () => {
  const [isCondensed, setIsCondensed] = useState(false);

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setupListener = async () => {
      try {
        unlisten = await listen<boolean>('condensed-mode-changed', (event) => {
          console.log('Condensed mode changed:', event.payload);
          setIsCondensed(event.payload);
        });
      } catch (error) {
        console.error('Failed to setup condensed mode listener:', error);
      }
    };

    setupListener();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  return { isCondensed };
};
