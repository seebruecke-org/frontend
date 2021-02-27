import { useState } from 'react';
import { useI18n } from 'next-localization';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { useStore } from '@/lib/store';

import BarsIcon from '@/public/icons/bars.svg';
import BookmarkIcon from '@/public/icons/bookmark-regular.svg';
import ChevronDownIcon from '@/public/icons/chevron-down-light.svg';
import ChevronUpIcon from '@/public/icons/chevron-up-light.svg';
import Logo from '@/components/Logo';
import MenuItem from '@/components/MenuItem';
import More from './More';
import SearchIcon from '@/public/icons/search-regular.svg';

import * as styles from './header.module.css';

function isPartiallyActive(fullPath, path) {
  return fullPath.startsWith(path);
}

function MoreToggle({ onClick = () => {}, isOpen }) {
  const Icon = isOpen ? ChevronUpIcon : ChevronDownIcon;

  return (
    <button
      type="button"
      className={`font-rubik text-small items-center text-white leading-none p-2 ${styles.moreToggle}`}
      onClick={onClick}
    >
      mehr
      <Icon className="w-6 h-6 ml-2" />
    </button>
  );
}

function Burger({ onClick = () => {} }) {
  return (
    <button
      type="button"
      className={`font-rubik text-3xs uppercase text-white text-center p-0 leading-none ml-10 sm:ml-auto justify-end tracking-wide ${styles.burger}`}
      onClick={onClick}
    >
      <BarsIcon className="w-12 h-12" />
      Menu
    </button>
  );
}

export default function Header() {
  const { locale, locales, asPath } = useRouter();
  const i18n = useI18n();
  const store = useStore() || {};
  const [moreIsOpen, setmoreIsOpen] = useState(false);

  const items = store?.menus?.header?.items;
  const headerSecondaryItems = store?.menus?.headerSecondary?.items;
  const otherLocales = locales.filter(
    (currentLocale) => currentLocale !== locale
  );
  const primaryItems = items && items.slice(0, items.length - 1);
  const cta = items && items.slice(items.length - 1);

  return (
    <header className="bg-orange-800 text-white flex flex-row justify-center w-full">
      <div className="flex flex-row align-bottom max-w-wide w-full">
        <Link href="/">
          <a
            className={`${styles.logoContainer} flex items-end justify-center pl-8 xl:pl-0`}
          >
            <Logo className="w-auto h-14 sm:h-12 md:h-14" />
          </a>
        </Link>

        <nav className="flex flex-col w-full relative">
          {headerSecondaryItems && headerSecondaryItems?.length > 0 && (
            <div className="md:flex-row md:space-x-3 md:justify-self-end md:ml-auto pr-52 hidden md:flex md:mb-3 pt-5">
              {otherLocales.map((currentLocale, index) => (
                <a
                  href="/"
                  locale={currentLocale}
                  key={`header-lang-nav-${index}`}
                  className="flex items-center font-rubik font-rubik-features text-xs uppercase leading-none text-gray-800 hover:text-white p-2"
                >
                  {currentLocale.toUpperCase()}
                </a>
              ))}

              <MenuItem
                path="/"
                label={i18n.t('header.search')}
                className="flex items-center font-rubik font-rubik-features text-xs uppercase leading-none text-gray-800 hover:text-white p-2"
              >
                <SearchIcon className="w-7 h-7 ml-2" />
              </MenuItem>

              <MenuItem
                path="/"
                label={i18n.t('header.myPlace')}
                className="flex items-center font-rubik font-rubik-features text-xs uppercase leading-none text-gray-800 hover:text-white p-2"
              >
                <BookmarkIcon className="w-7 h-7 ml-2" />
              </MenuItem>

              {headerSecondaryItems.map((item) => (
                <MenuItem
                  key={`menu-${item.label}`}
                  {...item}
                  className="font-rubik font-rubik-features text-xs uppercase leading-none text-gray-800 hover:text-white p-2"
                />
              ))}
            </div>
          )}

          {primaryItems && primaryItems.length > 0 && (
            <div
              className={`${styles.primaryItemsContainer} flex flex-row justify-around w-full pl-5 sm:pl-10 md:pl-20 mt-auto md:mt-0 md:pb-5 pr-8`}
            >
              {primaryItems.map((item, index) => (
                <MenuItem
                  key={`menu-${item.label}`}
                  {...item}
                  className={`font-rubik font-rubik-features text-small md:text-base uppercase font-bold leading-none hover:bg-white ${
                    isPartiallyActive(asPath, item.path) &&
                    'bg-white text-orange-800'
                  } hover:text-orange-800 py-2 px-3 whitespace-nowrap ${
                    styles.item
                  } ${styles[`item--${index + 1}`]}`}
                />
              ))}

              <MoreToggle
                onClick={() => setmoreIsOpen(!moreIsOpen)}
                isOpen={moreIsOpen}
              />

              <MenuItem
                {...cta[0]}
                className={`${styles.cta} font-rubik font-rubik-features text-2xs uppercase leading-none text-gray-700 hover:text-white hover:bg-black px-8 md:px-7 py-5 md:py-4 bg-white rounded-3xl whitespace-nowrap tracking-wide self-end`}
              />

              <Burger onClick={() => setmoreIsOpen(!moreIsOpen)} />

              {moreIsOpen && (
                <More onDismiss={() => setmoreIsOpen(false)}>
                  {primaryItems && primaryItems.length > 0 && (
                    <div>
                      {primaryItems.map((item, index) => (
                        <MenuItem
                          key={`menu-${item.label}`}
                          {...item}
                          className={`font-rubik font-rubik-features text-small uppercase font-bold leading-none py-10 md:py-5 px-20 mx-14 sm:mx-20 whitespace-nowrap border-gray-600 border-t hover:bg-gray-600 ${
                            styles.itemMore
                          } ${styles[`item--more-${index + 1}`]}`}
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
