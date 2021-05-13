import { useEffect } from 'react';

export default function useZustandDevtools(store) {
  useEffect(async () => {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    const { mountStoreDevtool } = await import('simple-zustand-devtools');
    mountStoreDevtool('Store', store);
  }, []);
}
