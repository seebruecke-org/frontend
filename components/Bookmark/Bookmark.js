import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';

import BookmarkIcon from '@/public/icons/bookmark-regular.svg';
import BookmarkSolidIcon from '@/public/icons/bookmark-solid.svg';
import useBookmarkedLocation from '@/lib/hooks/useBookmarkedLocation';

const BookmarkLocationModal = dynamic(
  () => import('@/components/Modals/BookmarkLocation'),
  { ssr: false }
);

export default function Bookmark() {
  const { t } = useTranslation();
  const [isHover, setIsHover] = useState(false);
  const [saveLocationOpen, setSaveLocationOpen] = useState(false);
  const { location, bookmark } = useBookmarkedLocation();

  return (
    <>
      <button
        type="button"
        className="group flex items-center mx-8 md:mx-0"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={() => {
          if (location) {
            bookmark(null);
          } else {
            setSaveLocationOpen(true);
          }
        }}
      >
        {location || isHover ? (
          <BookmarkSolidIcon className="w-10" />
        ) : (
          <BookmarkIcon className="w-10" />
        )}

        <span className="font-rubik text-xs ml-2">
          {t(
            location?.name ? 'city.bookmarkLocation' : 'city.bookmarkedLocation'
          )}
        </span>
      </button>

      {saveLocationOpen && (
        <BookmarkLocationModal onClose={() => setSaveLocationOpen(false)} />
      )}
    </>
  );
}
