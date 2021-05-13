import shallow from 'zustand/shallow';

import { useStore } from '@/lib/store/zustand';

export default function useBookmarkedLocation() {
  const { location, bookmark } = useStore(
    (store) => ({
      location: store.bookmarkedLocation,
      bookmark: store.setBookmarkedLocation
    }),
    shallow
  );

  return { location, bookmark };
}
