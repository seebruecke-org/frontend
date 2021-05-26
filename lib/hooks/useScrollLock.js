import { useLayoutEffect } from 'react';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

export default function useScrollLock(ref) {
  useLayoutEffect(() => {
    if (ref?.current) {
      disableBodyScroll(ref.current);
    }

    return () => clearAllBodyScrollLocks();
  }, []);
}
