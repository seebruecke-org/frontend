import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';

import BookmarkIcon from '@/public/icons/bookmark-solid.svg';
import useBookmarkedLocation from '@/lib/hooks/useBookmarkedLocation';

const BookmarkLocationModal = dynamic(
  () => import('@/components/Modals/BookmarkLocation'),
  { ssr: false }
);

function Wrapper({ link, children }) {
  const className =
    'flex flex-col bg-white text-black hover:bg-orange-800 hover:text-white rounded-xl p-8 pb-10 text-left';

  return (
    <>
      {link ? (
        <NextLink href={link}>
          <a>
            <div className={className}>{children}</div>
          </a>
        </NextLink>
      ) : (
        <button type="button" className={className}>
          {children}
        </button>
      )}
    </>
  );
}

export default function SavedLocation() {
  const { t } = useTranslation();
  const [saveLocationOpen, setSaveLocationOpen] = useState(false);
  const { location } = useBookmarkedLocation();
  const locationName = location?.name;

  return (
    <>
      <Wrapper link={location && location?.link}>
        <span className="font-brezel text-xs italic pl-14">
          {t(
            locationName
              ? 'footer.bookmarkedLocation'
              : 'footer.bookmarkLocation'
          )}
        </span>
        <span className="font-rubik text-base font-bold flex space-x-6 leading-none items-center">
          <BookmarkIcon className="w-8 h-auto flex-shrink-0" />
          <span>{locationName || t('footer.bookmarkYourLocation')}</span>
        </span>
      </Wrapper>

      {saveLocationOpen && (
        <BookmarkLocationModal onClose={() => setSaveLocationOpen(false)} />
      )}
    </>
  );
}
