import shallow from 'zustand/shallow';

import { useStore } from '@/lib/store/zustand';

const selector = (store) => ({
  location: store.bookmarkedLocation,
  bookmark: store.setBookmarkedLocation
});

export default function useBookmarkedLocation() {
  const { location, bookmark } = useStore(selector, shallow);

  return { location, bookmark };
}
