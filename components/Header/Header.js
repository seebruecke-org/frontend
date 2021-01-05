import { useRouter } from 'next/router';
import Link from 'next/link';

import { getLocalizedFrontpageSlug } from '../../lib/pages';

import Logo from '../../public/icons/logo.svg';

export default function Header() {
  const router = useRouter();

  return <header className="bg-orange-800 p-1 text-white">
    <Link href={getLocalizedFrontpageSlug(router.locale)}>
      <a>
        <Logo />
      </a>
    </Link>
  </header>
};
