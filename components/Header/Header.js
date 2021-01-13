import { useI18n } from 'next-localization';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { useStore } from '@/lib/store';

import BookmarkIcon from '@/public/icons/bookmark-regular.svg';
import HStack from '@/components/HStack';
import Logo from '@/components/Logo';
import MenuItem from '@/components/MenuItem';
import SearchIcon from '@/public/icons/search-regular.svg';
import VStack from '../VStack';

export default function Header() {
  const { locale, locales } = useRouter();
  const i18n = useI18n();
  const store = useStore() || {};

  const items = store?.menus?.header;
  const headerSecondaryItems = store?.menus?.headerSecondary?.items;
  const otherLocales = locales.filter(
    (currentLocale) => currentLocale !== locale
  );
  const primaryItems =
    items?.nodes && items.nodes.slice(0, items.nodes.length - 1);
  const cta = items?.nodes && items.nodes.slice(items.nodes.length - 1);

  return (
    <header className="bg-orange-800 p-5 text-white flex flex-row justify-center">
      <div className="flex flex-row align-bottom max-w-wide w-full">
        <Link href="/">
          <a className="flex items-end p-2 mr-5">
            <Logo />
          </a>
        </Link>

        <VStack gap={5} as="nav">
          {headerSecondaryItems && headerSecondaryItems?.nodes?.length > 0 && (
            <HStack gap={3} className="flex justify-self-end ml-auto pr-48">
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

              {headerSecondaryItems.nodes.map((node) => (
                <MenuItem
                  key={`menu-${node.label}`}
                  {...node}
                  className="font-rubik text-xs uppercase leading-none text-gray-800 hover:text-white p-2"
                />
              ))}
            </HStack>
          )}

          {primaryItems && primaryItems.length > 0 && (
            <HStack gap={10} className="flex items-end ml-10">
              {primaryItems.map((node) => (
                <MenuItem
                  key={`menu-${node.label}`}
                  {...node}
                  className="font-rubik text-base uppercase font-bold leading-none hover:bg-white hover:text-orange-800 p-2"
                />
              ))}

              <MenuItem
                {...cta[0]}
                className="font-rubik text-2xs uppercase leading-none text-gray-700 hover:text-white px-7 py-4 bg-white rounded-3xl"
              />
            </HStack>
          )}
        </VStack>
      </div>
    </header>
  );
}
