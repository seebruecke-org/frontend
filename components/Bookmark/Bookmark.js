import { useState } from 'react';
import { useTranslation } from 'next-i18next';

import BookmarkIcon from '@/public/icons/bookmark-regular.svg';
import BookmarkSolidIcon from '@/public/icons/bookmark-solid.svg';
import useBookmarkedLocation from '@/lib/hooks/useBookmarkedLocation';

export default function Bookmark({ name, link }) {
  const { t } = useTranslation();
  const [isHover, setIsHover] = useState(false);
  const { location, bookmark } = useBookmarkedLocation();

  return (
    <>
      <button
        type="button"
        className="group flex items-center mx-8 md:mx-0"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={() => {
          bookmark(
            location
              ? null
              : {
                  name,
                  link
                }
          );
        }}
      >
        {(location && location?.name === name) || isHover ? (
          <BookmarkSolidIcon className="w-10" />
        ) : (
          <BookmarkIcon className="w-10" />
        )}

        <span className="font-rubik text-xs ml-2">
          {t(
            location && location?.name
              ? 'city.bookmarkedLocation'
              : 'city.bookmarkLocation'
          )}
        </span>
      </button>
    </>
  );
}
