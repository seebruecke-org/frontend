import { useI18n } from 'next-localization';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { useStore } from '@/lib/store';
import { getLocalizedFrontpageSlug } from '../../lib/pages';

import BookmarkIcon from '@/public/icons/bookmark-regular.svg';
import HStack from '@/components/HStack';
import Logo from '@/components/Logo';
import MenuItem from '@/components/MenuItem';
import SearchIcon from '@/public/icons/search-regular.svg';
import VStack from '../VStack';

export default function Header() {
  const router = useRouter();
  const i18n = useI18n();
  const { menus: { header: { items }, headerSecondary: { items: headerSecondaryItems } } } = useStore();

  const primaryItems = items?.nodes && items.nodes.slice(0, items.nodes.length - 2);
  const cta = items?.nodes && items.nodes.slice(items.nodes.length - 1);

  return <header className="bg-orange-800 p-5 text-white flex flex-row justify-center">
    <div className="flex flex-row align-bottom max-w-wide w-full">
      <Link href={getLocalizedFrontpageSlug(router.locale)}>
        <a className="flex items-end p-2 mr-5">
          <Logo />
        </a>
      </Link>

      <VStack gap={5} as="nav">
        {headerSecondaryItems && headerSecondaryItems?.nodes?.length > 0 && (
          <HStack gap={3} className="flex justify-self-end ml-auto pr-48">
            <MenuItem path="/" label={i18n.t('header.search')} className="flex items-center font-rubik text-xs uppercase leading-none text-gray-700 hover:text-white p-2">
              <SearchIcon className="w-7 h-7 ml-2" />
            </MenuItem>

            <MenuItem path="/" label={i18n.t('header.myPlace')} className="flex items-center font-rubik text-xs uppercase leading-none text-gray-700 hover:text-white p-2">
              <BookmarkIcon className="w-7 h-7 ml-2" />
            </MenuItem>

            {headerSecondaryItems.nodes.map(node =>
              <MenuItem key={`menu-${node.label}`} {...node} className="font-rubik text-xs uppercase leading-none text-gray-700 hover:text-white p-2" />)}
          </HStack>
        )}

        {primaryItems.length > 0 && (
          <HStack gap={10} className="flex items-end ml-10">
            {primaryItems.map(node =>
              <MenuItem key={`menu-${node.label}`} {...node} className="font-rubik text-base uppercase font-bold leading-none hover:bg-white hover:text-orange-800 p-2" />)}

            <MenuItem {...cta[0]} className="font-rubik text-2xs uppercase leading-none text-gray-700 hover:text-white px-7 py-4 bg-white rounded-3xl" />
          </HStack>
        )}
      </VStack>
    </div>
  </header>
};
