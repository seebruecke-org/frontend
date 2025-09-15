import { useTranslation } from 'next-i18next';
import NextLink from 'next/link';

import * as styles from '../../Richtext/Link/link.module.css';
import clsx from 'clsx';

function Wrapper({ slug, children }) {
  const { t } = useTranslation('slugs');

  if (slug) {
    return (
      <NextLink href={`/${t('actions')}/${slug}`}>
        <a className="flex flex-col bg-turquoise-300 hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white px-8 py-10 md:p-10 h-full">
          {children}
        </a>
      </NextLink>
    );
  }

  return (
    <div className="bg-turquoise-300 px-7 py-10 md:p-10 h-full">{children}</div>
  );
}

export default function ActionTeaser({ title, city, start, address, slug }) {
  const { t } = useTranslation();

  return (
    <Wrapper slug={slug}>
      

      <h2 className="font-rubik text-medium font-bold leading-tight mt-2">
        {city}
      </h2>

      {title && (
        <p className="block font-rubik text-xs mt-3 mb-2 mt-auto mb-auto">{title}</p>
      )}

      {start && (
        <span className="block font-rubik text-2xs mt-5">
          {start}
        </span>
      )}

      {address && (
        <span className="block font-rubik text-2xs mb-2">
          {address}
        </span>
      )}

      {slug && (
        <span className={clsx(
          'font-rubik text-xs ml-auto',
          styles.whitelink
        )}>{t('action.moreInfo')}</span>
      )}
      
    </Wrapper>
  );
}
