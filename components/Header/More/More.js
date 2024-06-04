import { useTranslation } from 'next-i18next';
import { useRef } from 'react';
import clsx from 'clsx';
import Link from 'next/link';

import useScrollLock from '@/lib/hooks/useScrollLock';
import useBookmarkedLocation from '@/lib/hooks/useBookmarkedLocation';
import TimesIcon from '@/public/icons/times.svg';

import * as styles from './more.module.css';

function Footer({ onDismiss }) {
  const { t } = useTranslation();
  const { t: ts } = useTranslation('slugs');
  const { location } = useBookmarkedLocation();

  return (
    <footer className="flex bg-gray-700 md:hidden mt-auto border-gray-600 border-t fixed w-full bottom-0 left-0">
      {location && location?.link ? (
        <Link href={location.link}
            className="py-5 text-center font-rubik text-xs font-bold uppercase hover:bg-white hover:text-gray-800"
            onClick={onDismiss}
          >
            {t('header.gotoMyPlace')}
        </Link>
      ) : (
        <button
          className="py-5 w-full text-center font-rubik text-xs font-bold uppercase border-r border-gray-600 hover:bg-white hover:text-gray-800"
          onClick={onDismiss}
        >
          {t('header.myPlace')}
        </button>
      )}

      {/*<Link href={`/${ts('search')}`}>*/}
      {/*  <a*/}
      {/*    className="w-1/2 py-5 text-center font-rubik text-xs font-bold uppercase hover:bg-white hover:text-gray-800"*/}
      {/*    onClick={onDismiss}*/}
      {/*  >*/}
      {/*    {t('header.search')}*/}
      {/*  </a>*/}
      {/*</Link>*/}
    </footer>
  );
}

export default function More({ children, onDismiss = () => {} }) {
  const { t } = useTranslation();
  const ref = useRef(null);

  useScrollLock(ref);

  return (
    <div
      className="flex flex-col bg-gray-800 absolute top-0 md:top-full right-0 w-screen md:w-auto h-screen md:h-auto pt-5 md:pt-16 md:pl-16 md:pr-16 z-40 pb-48 md:pb-0 overflow-y-auto"
      ref={ref}
    >
      <span
        className={clsx(
          'w-0 h-0 border text-gray-800 absolute left-2/4',
          styles.triangle
        )}
      />

      <button
        type="button"
        className="justify-end ml-auto mr-5 mb-20 md:hidden flex flex-col items-center outline-none"
        onClick={onDismiss}
      >
        <TimesIcon className="w-16 h-auto" />
        <span className="font-rubik text-3xs uppercase tracking-wide -mt-1">
          {t('modal.close')}
        </span>
      </button>

      {children}

      {/*<Footer onDismiss={onDismiss} />*/}
    </div>
  );
}
