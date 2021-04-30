import { useTranslation } from 'next-i18next';
import clsx from 'clsx';
import React from 'react';

import FacebookIcon from '@/public/icons/facebook-square-brands.svg';
import InstagramIcon from '@/public/icons/instagram-brands.svg';
import Logo from '@/components/Logo';
import StrapiLink from '@/components/StrapiLink';
import SavedLocation from './SavedLocation';
import TwitterIcon from '@/public/icons/twitter-brands.svg';

function SocialMedia({ className = '' }) {
  return (
    <div className={clsx('flex space-x-4', className)}>
      <FacebookIcon className="w-12 h-12" />
      <InstagramIcon className="w-12 h-12" />
      <TwitterIcon className="w-12 h-12" />
    </div>
  );
}

function Menu({ title, items }) {
  return (
    <div className="flex flex-col space-y-10">
      <p className="font-rubik text-xs uppercase font-bold">{title}</p>

      {items && items.length > 0 && (
        <ul className="grid grid-cols-2 md:grid-cols-1" aria-label={title}>
          {items.map((node, index) => (
            <li key={`footer-${title}-${index}`}>
              <StrapiLink
                className="font-rubik text-xs hover:underline block py-3 md:py-5"
                link={node}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Footer({ itemsTakePart, itemsAbout, itemsMeta }) {
  const { t } = useTranslation();
  const hasBookmarkedItem = false;

  return (
    <footer className="flex justify-center justify-self-end mt-auto bg-gray-700 text-white py-20 px-8 md:px-0">
      <div className="grid gap-y-20 gap-x-10 grid-cols-1 md:grid-cols-12 max-w-wide w-full">
        <div className="col-start-1 col-span-1 md:col-start-1 md:col-span-3 flex-col space-y-8">
          <SavedLocation
            name={hasBookmarkedItem ? 'Berlin' : false}
            path={hasBookmarkedItem ? '/mach-mit/deutschland/berlin' : false}
          />

          <a href="/" className="font-bold block">
            {t('footer.langEn')}
          </a>
        </div>

        <div className="md:col-start-4 md:col-span-3">
          <Menu {...itemsTakePart} />
        </div>

        <div className="md:col-start-7 md:col-span-3">
          <Menu {...itemsAbout} />
        </div>

        <div className="md:col-start-10 md:col-span-3">
          <div className="flex flex-col space-y-5">
            <Logo />

            <p className="font-rubik text-xs font-rubik-features">
              {t('footer.tagline')}
            </p>

            <div className="flex flex-col space-y-6 md:space-y-6 pt-6 md:pt-10">
              <a
                href="https://www.seebruecke.at"
                className="font-rubik text-xs font-rubik-features hover:underline"
              >
                {t('footer.austria')}
              </a>

              <a
                href="https://seebruecke.ch"
                className="font-rubik text-xs font-rubik-features hover:underline"
              >
                {t('footer.switzerland')}
              </a>
            </div>

            <SocialMedia className="md:hidden pt-20" />
          </div>
        </div>

        {itemsMeta?.items && (
          <div className="flex items-center justify-between col-start-1 md:col-span-12">
            <nav className="flex space-x-10">
              {itemsMeta.items.map((item, index) => (
                <StrapiLink
                  className="font-rubik text-xs font-bold hover:underline"
                  key={`footer-meta-${index}`}
                  link={item}
                />
              ))}
            </nav>

            <SocialMedia className="hidden md:flex mr-72" />
          </div>
        )}
      </div>
    </footer>
  );
}
