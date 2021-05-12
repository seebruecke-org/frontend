import { useTranslation } from 'next-i18next';
import clsx from 'clsx';

import TimesIcon from '@/public/icons/times.svg';

import * as styles from './more.module.css';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="flex justify-end bg-gray-700 md:hidden mt-auto border-gray-600 border-t">
      <button className="w-1/2 py-5 text-center font-rubik text-xs font-bold uppercase border-r border-gray-600">
        {t('header.myPlace')}
      </button>

      <a
        href={t('slugs.search')}
        className="w-1/2 py-5 text-center font-rubik text-xs font-bold uppercase"
      >
        {t('header.search')}
      </a>
    </footer>
  );
}

export default function More({ children, onDismiss = () => {} }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col bg-gray-800 absolute top-0 md:top-full right-0 w-screen md:w-auto h-screen md:h-auto pt-5 md:pt-16 md:pl-16 md:pr-16 z-40">
      <span
        className={clsx(
          'w-0 h-0 border text-gray-800 absolute left-2/4',
          styles.triangle
        )}
      />

      <button
        type="button"
        className="justify-end ml-auto mr-5 mb-20 md:hidden"
        onClick={onDismiss}
      >
        <TimesIcon className="w-16 h-auto" />
        <span className="font-rubik text-3xs uppercase tracking-wide -mt-1">
          {t('modal.close')}
        </span>
      </button>

      {children}

      <Footer />
    </div>
  );
}
