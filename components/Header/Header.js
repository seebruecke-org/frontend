import { useI18n } from 'next-localization';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { useStore } from '@/lib/store';

import BookmarkIcon from '@/public/icons/bookmark-regular.svg';
import Logo from '@/components/Logo';
import MenuItem from '@/components/MenuItem';
import SearchIcon from '@/public/icons/search-regular.svg';

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
    <header className="bg-orange-800 p-5 text-white flex flex-row justify-center w-full overflow-x-hidden">
      <div className="flex flex-row align-bottom max-w-wide w-full">
        <Link href="/">
          <a className="flex items-end p-2 mr-5">
            <Logo />
          </a>
        </Link>

        <nav className="flex flex-col space-y-5">
          {headerSecondaryItems && headerSecondaryItems?.length > 0 && (
            <div className="md:flex-row md:space-x-3 md:justify-self-end md:ml-auto pr-48 hidden md:flex">
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
            <div className="flex flex-row space-x-10 items-end ml-10">
              {primaryItems.map((item) => (
                <MenuItem
                  key={`menu-${item.label}`}
                  {...item}
                  className="font-rubik text-base uppercase font-bold leading-none hover:bg-white hover:text-orange-800 p-2 whitespace-nowrap"
                />
              ))}

              <MenuItem
                {...cta[0]}
                className="font-rubik text-2xs uppercase leading-none text-gray-700 hover:text-white hover:bg-black px-7 py-4 bg-white rounded-3xl whitespace-nowrap"
              />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
