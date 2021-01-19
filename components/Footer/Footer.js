import { useI18n } from 'next-localization';
import { useRouter } from 'next/router';
import Link from 'next/link';
import React from 'react';

import FacebookIcon from '@/public/icons/facebook-square-brands.svg';
import HStack from '@/components/HStack';
import InstagramIcon from '@/public/icons/instagram-brands.svg';
import Logo from '@/components/Logo';
import MenuItem from '@/components/MenuItem';
import TwitterIcon from '@/public/icons/twitter-brands.svg';
import VStack from '@/components/VStack';

import { useStore } from '@/lib/store';

function SocialMedia({ className = '' }) {
  return (
    <div className={`flex space-x-4 ${className}`}>
      <FacebookIcon className="w-12 h-12" />
      <InstagramIcon className="w-12 h-12" />
      <TwitterIcon className="w-12 h-12" />
    </div>
  );
}

function Menu({ title, items }) {
  return (
    <VStack as="div" gap={10}>
      <h4 className="font-rubik text-xs uppercase font-bold">{title}</h4>

      {items.length > 0 && (
        <ul className="grid grid-cols-2 md:grid-cols-1">
          {items.map((node, index) => (
            <li key={`footer-${title}-${index}`}>
              <MenuItem
                className="font-rubik text-xs hover:underline block py-3 md:py-5"
                {...node}
              />
            </li>
          ))}
        </ul>
      )}
    </VStack>
  );
}

export default function Footer() {
  const i18n = useI18n();
  const { locale } = useRouter();
  const {
    menus: { footerTakePart, footerAbout, footerMeta }
  } = useStore();

  return (
    <footer className="flex justify-center justify-self-end mt-auto bg-gray-700 text-white py-20 px-10 md:px-0">
      <div className="grid gap-y-20 grid-cols-1 md:grid-cols-12 max-w-wide w-full">
        <div className="col-start-1 col-span-1 md:col-start-1 md:col-span-3">
          <Link href="/" locale={locale === 'de' ? 'en' : 'de'}>
            <a className="font-bold">{i18n.t('footer.langEn')}</a>
          </Link>
        </div>

        <div className="md:col-start-4 md:col-span-3">
          <Menu {...footerTakePart} />
        </div>

        <div className="md:col-start-7 md:col-span-3">
          <Menu {...footerAbout} />
        </div>

        <div className="md:col-start-10 md:col-span-3">
          <VStack gap={5}>
            <Logo />

            <p className="font-rubik text-xs">{i18n.t('footer.tagline')}</p>

            <SocialMedia className="md:hidden pt-20" />
          </VStack>
        </div>

        {footerMeta?.items && (
          <div className="flex items-center justify-between col-start-1 md:col-span-12">
            <HStack as="nav" gap={10}>
              {footerMeta.items.map((item, index) => (
                <MenuItem
                  className="font-rubik text-xs font-bold hover:underline"
                  key={`footer-meta-${index}`}
                  {...item}
                />
              ))}
            </HStack>

            <SocialMedia className="hidden md:flex mr-72" />
          </div>
        )}
      </div>
    </footer>
  );
}
