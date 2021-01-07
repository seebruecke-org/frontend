import { useRouter } from 'next/router';
import Link from 'next/link';

import { useStore } from '@/lib/store';
import { getLocalizedFrontpageSlug } from '../../lib/pages';

import HStack from '@/components/HStack';
import Logo from '@/components/Logo';
import MenuItem from '@/components/MenuItem';

export default function Header() {
  const router = useRouter();
  const { menus: { header: { items } } } = useStore();

  return <header className="bg-orange-800 p-5 text-white flex flex-row justify-center">
    <div className="flex flex-row align-bottom max-w-wide w-full">
      <Link href={getLocalizedFrontpageSlug(router.locale)}>
        <a class="p-2">
          <Logo />
        </a>
      </Link>

      {items && items?.nodes?.length > 0 && (
        <HStack as="nav" className="flex items-end ml-10">
          {items.nodes.map(node =>
            <MenuItem key={`menu-${node.label}`} {...node} className="text-rubik-xl uppercase font-bold leading-none ml-4 hover:bg-white hover:text-orange-800 p-2" />)}
        </HStack>
      )}
    </div>
  </header>
};
