import { useI18n } from 'next-localization';
import NextLink from 'next/link';

import BookmarkIcon from '@/public/icons/bookmark-solid.svg';

export default function SavedLocation({ name, path }) {
  const i18n = useI18n();

  return (
    <NextLink href={path}>
      <a className="flex flex-col bg-white text-black hover:bg-orange-800 hover:text-white rounded-xl p-8 pb-10">
        <span className="font-brezel text-xs italic pl-14">
          {i18n.t('footer.savedLocation')}
        </span>
        <span className="font-rubik text-base md:text-medium font-bold flex space-x-6 leading-none items-center">
          <BookmarkIcon className="w-8 h-auto flex-shrink-0" />
          <span>{name}</span>
        </span>
      </a>
    </NextLink>
  );
}
