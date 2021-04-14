import { useTranslation } from 'next-i18next';
import NextLink from 'next/link';

import BookmarkIcon from '@/public/icons/bookmark-solid.svg';

function Wrapper({ path, children }) {
  const innerClassName =
    'flex flex-col bg-white text-black hover:bg-orange-800 hover:text-white rounded-xl p-8 pb-10 text-left';

  if (path) {
    return (
      <NextLink href={path}>
        <a className={innerClassName}>{children}</a>
      </NextLink>
    );
  }

  return (
    <button type="button" className={innerClassName}>
      {children}
    </button>
  );
}

export default function SavedLocation({ name, path }) {
  const { t } = useTranslation();

  return (
    <Wrapper path={path}>
      <span className="font-brezel text-xs italic pl-14">
        {t(name ? 'footer.bookmarkedLocation' : 'footer.bookmarkLocation')}
      </span>
      <span className="font-rubik text-base md:text-medium font-bold flex space-x-6 leading-none items-center">
        <BookmarkIcon className="w-8 h-auto flex-shrink-0" />
        <span>{name || t('footer.bookmarkYourLocation')}</span>
      </span>
    </Wrapper>
  );
}
