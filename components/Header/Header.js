import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import BarsIcon from '@/public/icons/bars.svg';
import BookmarkIcon from '@/public/icons/bookmark-regular.svg';
import BookmarkSolidIcon from '@/public/icons/bookmark-solid.svg';
import ChevronDownIcon from '@/public/icons/chevron-down-light.svg';
import ChevronUpIcon from '@/public/icons/chevron-up-light.svg';
import Logo from '@/components/Logo';
import StrapiLink from '@/components/StrapiLink';
import More from './More';
import SearchIcon from '@/public/icons/search-regular.svg';
import useBookmarkedLocation from '@/lib/hooks/useBookmarkedLocation.js';

import * as styles from './header.module.css';

const SearchModal = dynamic(() => import('@/components/Modals/Search'), {
  ssr: false
});
const BookmarkLocationModal = dynamic(
  () => import('@/components/Modals/BookmarkLocation'),
  { ssr: false }
);

function MoreToggle({ onClick = () => {}, isOpen }) {
  const { t } = useTranslation();
  const Icon = isOpen ? ChevronUpIcon : ChevronDownIcon;

  return (
    <button
      type="button"
      className={clsx(
        'font-rubik text-small items-center text-white leading-none p-2',
        styles.moreToggle
      )}
      onClick={onClick}
    >
      {t('header.more')}
      <Icon className="w-6 h-6 ml-2" />
    </button>
  );
}

function Burger({ onClick = () => {} }) {
  return (
    <button
      type="button"
      className={clsx(
        'font-rubik text-3xs uppercase text-white hover:text-black focus:text-black text-center leading-none ml-8 sm:ml-auto justify-end tracking-wide outline-none',
        styles.burger
      )}
      onClick={onClick}
    >
      <BarsIcon className="w-16 h-auto" />
      <span className="block font-bold">Menu</span>
    </button>
  );
}

function Bookmark() {
  const { t } = useTranslation();
  const [saveBookmarkLocationOpen, setBookmarkLocationOpen] = useState(false);
  const { location } = useBookmarkedLocation();

  if (location && location?.link) {
    return (
      <Link href={location.link}>
        <a className="flex items-center font-rubik font-rubik-features text-xs uppercase leading-none text-gray-800 hover:text-white p-2 flex-nowrap">
          <span>{t('header.gotoMyPlace')}</span>
          <BookmarkSolidIcon className="w-7 h-7 ml-2" />
        </a>
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        className="flex items-center font-rubik font-rubik-features text-xs uppercase leading-none text-gray-800 hover:text-white p-2 flex-nowrap"
        onClick={() => setBookmarkLocationOpen(true)}
      >
        {t('header.myPlace')}
        <BookmarkIcon className="w-7 h-7 ml-2" />
      </button>

      {saveBookmarkLocationOpen && (
        <BookmarkLocationModal onClose={() => setBookmarkLocationOpen(false)} />
      )}
    </>
  );
}

function Search() {
  const { t } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <Link href={`/${t('slugs.search')}`}>
        <a
          className="flex items-center font-rubik font-rubik-features text-xs uppercase leading-none text-gray-800 hover:text-white p-2"
          onClick={(event) => {
            event.preventDefault();
            setSearchOpen(true);
          }}
        >
          {t('header.search')}
          <SearchIcon className="w-7 h-7 ml-2" />
        </a>
      </Link>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}

function Locales({ locales }) {
  return (
    <>
      {locales.map((currentLocale, index) => (
        <a
          href="/"
          locale={currentLocale}
          key={`header-lang-nav-${index}`}
          className="flex items-center font-rubik font-rubik-features text-xs uppercase leading-none text-gray-800 hover:text-white p-2"
        >
          {currentLocale.toUpperCase()}
        </a>
      ))}
    </>
  );
}

export default function Header({ metaItems, items }) {
  const { locale, locales, asPath } = useRouter();
  const { t } = useTranslation();
  const [moreIsOpen, setmoreIsOpen] = useState(false);

  const otherLocales = locales.filter(
    (currentLocale) => currentLocale !== locale
  );
  const primaryItems = items && items.slice(0, items.length - 1);
  const cta = items && items.slice(items.length - 1);

  function isPartiallyActive(currentPagePath, { url = '' }) {
    // the homepage needs some special treatment here
    if (currentPagePath === '/') {
      return false;
    }

    const firstPagePathFragment = currentPagePath.split('/')[1];
    const slug = `slugs.${firstPagePathFragment}`;
    const currentPathFragmentLocalized = t(slug);

    let normalizedPagePath = firstPagePathFragment;

    if (slug !== currentPathFragmentLocalized) {
      normalizedPagePath = currentPathFragmentLocalized;
    }

    return url.endsWith(normalizedPagePath);
  }

  return (
    <header className="bg-orange-800 text-white flex flex-row justify-center w-full">
      <div className="flex flex-row align-bottom max-w-wide w-full">
        <Link href="/">
          <a
            className={clsx(
              styles.logoContainer,
              'flex items-end justify-center pl-5 xl:pl-0'
            )}
          >
            <Logo className="w-auto h-10 sm:h-12 md:h-14" />
          </a>
        </Link>

        <nav className="flex flex-col w-full relative">
          <div className="md:flex-row md:space-x-3 md:justify-self-end md:ml-auto pr-52 hidden md:flex md:mb-3 pt-5">
            <Locales locales={otherLocales} />
            <Search />
            <Bookmark />

            {metaItems &&
              metaItems.length > 0 &&
              metaItems.map((item) => (
                <StrapiLink
                  key={`menu-${item.label}`}
                  link={item}
                  className="font-rubik font-rubik-features text-xs uppercase leading-none text-gray-800 hover:text-white p-2"
                />
              ))}
          </div>

          {primaryItems && primaryItems.length > 0 && (
            <div
              className={clsx(
                styles.primaryItemsContainer,
                'flex flex-row justify-around w-full pl-3 sm:pl-10 pr-5 sm:pr-8 md:pl-20 mt-auto md:mt-0 md:pb-5'
              )}
            >
              {primaryItems.map((item, index) => (
                <StrapiLink
                  key={`menu-${item.label}`}
                  link={item}
                  className={clsx(
                    'font-rubik font-rubik-features text-small md:text-base uppercase font-bold leading-none hover:bg-white',
                    isPartiallyActive(asPath, item) &&
                      'bg-white text-orange-800',
                    'hover:text-orange-800 py-2 px-3 whitespace-nowrap',
                    styles.item,
                    styles[`item--${index + 1}`]
                  )}
                />
              ))}

              <MoreToggle
                onClick={() => setmoreIsOpen(!moreIsOpen)}
                isOpen={moreIsOpen}
              />

              <StrapiLink
                link={cta[0]}
                className={clsx(
                  styles.cta,
                  'font-rubik font-rubik-features text-2xs uppercase leading-none text-gray-700 hover:text-white hover:bg-black px-7 md:px-7 bg-white rounded-full whitespace-nowrap sm:tracking-wide self-end'
                )}
              />

              <Burger onClick={() => setmoreIsOpen(!moreIsOpen)} />

              {moreIsOpen && (
                <More onDismiss={() => setmoreIsOpen(false)}>
                  {primaryItems && primaryItems.length > 0 && (
                    <div>
                      {primaryItems.map((item, index) => (
                        <StrapiLink
                          key={`menu-${item.label}`}
                          link={item}
                          className={clsx(
                            'font-rubik font-rubik-features text-small uppercase font-bold leading-none py-10 md:py-5 px-20 mx-14 sm:mx-20 whitespace-nowrap border-gray-600 border-t hover:bg-gray-600',
                            styles.itemMore,
                            styles[`item--more-${index + 1}`]
                          )}
                          onClick={() => setmoreIsOpen(false)}
                        />
                      ))}
                    </div>
                  )}
                </More>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
