import { useTranslation } from 'next-i18next';
import { format } from 'date-fns';
import clsx from 'clsx';
import NextLink from 'next/link';

import Heading from '@/components/Heading';
import Media from '@/components/Media';

export default function NewsEntry({
  title,
  media,
  publishedAt,
  type,
  excerpt = '',
  slug
}) {
  const { t } = useTranslation();

  const translatedType = t(`news.type.${type}`);

  return (
    <article className="grid grid-layout-primary gap-8 col-span-full pt-12 md:pt-20 px-8 md:px-0 relative group">
      <span className="col-start-2 col-span-10 h-1 border-b border-gray-300 mb-4 md:mb-12" />

      {media && (
        <div className="col-span-full md:col-start-2 md:col-span-4">
          <Media media={media} />
        </div>
      )}

      <div
        className={clsx(
          'col-span-full',
          media
            ? 'md:col-start-6 md:col-span-8'
            : 'md:col-start-3 md:col-span-11'
        )}
      >
        <header className="font-rubik text-xs text-gray-600 flex space-x-8">
          {format(new Date(publishedAt), t('news.dateFormat'))}
          &nbsp;·&nbsp;{translatedType}
        </header>

        <NextLink href={`/${t('news.slug')}/${slug}/`}>
          <a className="group-hover:underline">
            <Heading level={3}>{title}</Heading>
          </a>
        </NextLink>

        {excerpt && (
          <p className="font-rubik text-base md:text-medium mt-6">{excerpt}</p>
        )}
      </div>

      <NextLink href={`/${t('news.slug')}/${slug}/`}>
        <a
          className="absolute top-0 left-0 h-full w-full z-10 opacity-0"
          tabIndex="-1"
          aria-hidden
        >
          <Heading level={3}>{title}</Heading>
        </a>
      </NextLink>
    </article>
  );
}
