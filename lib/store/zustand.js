import { useLayoutEffect } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';
import Cookies from 'js-cookie';

import { BOOKMARKED_LOCATION_COOKIE_NAME } from '@/lib/constants';

let store;

const initialState = {};

const zustandContext = createContext();

export const Provider = zustandContext.Provider;

export const useStore = zustandContext.useStore;

export const initializeStore = (preloadedState = {}) => {
  return create((set) => ({
    ...initialState,
    ...preloadedState,

    setBookmarkedLocation: (location) => {
      if (location) {
        Cookies.set(BOOKMARKED_LOCATION_COOKIE_NAME, JSON.stringify(location));
      } else {
        Cookies.remove(BOOKMARKED_LOCATION_COOKIE_NAME);
      }

      set({
        bookmarkedLocation: location
      });
    }
  }));
};

export function useCreateStore(initialState) {
  // For SSR & SSG, always use a new store.
  if (typeof window === 'undefined') {
    return () => initializeStore(initialState);
  }

  // For CSR, always re-use same store.
  store = store ?? initializeStore(initialState);
  // And if initialState changes, then merge states in the next render cycle.

  useLayoutEffect(() => {
    if (initialState && store) {
      store.setState({
        ...store.getState(),
        ...initialState
      });
    }
  }, [initialState]);

  return () => store;
}
