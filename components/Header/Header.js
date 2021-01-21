import { useI18n } from 'next-localization';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { useStore } from '@/lib/store';

import BarsIcon from '@/public/icons/bars.svg';
import BookmarkIcon from '@/public/icons/bookmark-regular.svg';
import Logo from '@/components/Logo';
import MenuItem from '@/components/MenuItem';
import SearchIcon from '@/public/icons/search-regular.svg';

import * as styles from './header.module.css';

export default function Header() {
  const { locale, locales } = useRouter();
  const i18n = useI18n();
  const store = useStore() || {};

  const items = store?.menus?.header?.items;
  const headerSecondaryItems = store?.menus?.headerSecondary?.items;
  const otherLocales = locales.filter(
    (currentLocale) => currentLocale !== locale
  );
  const primaryItems = items && items.slice(0, items.length - 1);
  const cta = items && items.slice(items.length - 1);

  return (
    <header className="bg-orange-800 px-5 pt-5 pb-6 text-white flex flex-row justify-center w-full overflow-x-hidden">
      <div className="flex flex-row align-bottom max-w-wide w-full">
        <Link href="/">
          <a className="flex items-end justify-center p-2">
            <Logo className="w-auto h-10 sm:h-12 md:h-14" />
          </a>
        </Link>

        <nav className="flex flex-col w-full">
          {headerSecondaryItems && headerSecondaryItems?.length > 0 && (
            <div className="md:flex-row md:space-x-3 md:justify-self-end md:ml-auto pr-52 hidden md:flex md:mb-3">
              {otherLocales.map((currentLocale, index) => (
                <MenuItem
                  path="/"
                  locale={currentLocale}
                  label={currentLocale.toUpperCase()}
                  key={`header-lang-nav-${index}`}
                  className="flex items-center font-rubik text-xs uppercase leading-none text-gray-800 hover:text-white p-2"
                />
              ))}

              <MenuItem
                path="/"
                label={i18n.t('header.search')}
                className="flex items-center font-rubik text-xs uppercase leading-none text-gray-800 hover:text-white p-2"
              >
                <SearchIcon className="w-7 h-7 ml-2" />
              </MenuItem>

              <MenuItem
                path="/"
                label={i18n.t('header.myPlace')}
                className="flex items-center font-rubik text-xs uppercase leading-none text-gray-800 hover:text-white p-2"
              >
                <BookmarkIcon className="w-7 h-7 ml-2" />
              </MenuItem>

              {headerSecondaryItems.map((item) => (
                <MenuItem
                  key={`menu-${item.label}`}
                  {...item}
                  className="font-rubik text-xs uppercase leading-none text-gray-800 hover:text-white p-2"
                />
              ))}
            </div>
          )}

          {primaryItems && primaryItems.length > 0 && (
            <div className="flex flex-row justify-around w-full pl-5 sm:pl-10 md:pl-20 items-end mt-auto self-end">
              {primaryItems.map((item, index) => (
                <MenuItem
                  key={`menu-${item.label}`}
                  {...item}
                  className={`font-rubik text-small md:text-base uppercase font-bold leading-none hover:bg-white hover:text-orange-800 p-2 whitespace-nowrap ${
                    styles.item
                  } ${styles[`item--${index + 1}`]}`}
                />
              ))}

              <MenuItem
                {...cta[0]}
                className="font-rubik text-2xs uppercase leading-none text-gray-700 hover:text-white hover:bg-black px-6 md:px-7 py-4 bg-white rounded-3xl whitespace-nowrap"
              />

              <button
                type="button"
                className={`font-rubik text-3xs uppercase text-white text-center p-0 leading-none ${styles.burger}`}
              >
                <BarsIcon className="w-12 h-12" />
                Menu
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
