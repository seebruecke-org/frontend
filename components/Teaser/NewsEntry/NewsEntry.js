import { useI18n } from 'next-localization';
import { format } from 'date-fns';
import NextLink from 'next/link';

import Heading from '@/components/Heading';
import Image from '@/components/Image';

export default function NewsEntry({
  title,
  image,
  publishedAt,
  type,
  excerpt = '',
  slug
}) {
  const i18n = useI18n();

  return (
    <article className="grid grid-layout-primary gap-8 col-span-full pt-12 md:pt-20 px-8 md:px-0 relative">
      {image && (
        <div className="col-span-full md:col-start-2 md:col-span-4">
          <Image image={image.image} />
        </div>
      )}

      <div
        className={`col-span-full ${
          image
            ? 'md:col-start-6 md:col-span-8'
            : 'md:col-start-3 md:col-span-11'
        }`}
      >
        <header className="font-rubik text-xs text-gray-600 flex space-x-8">
          <span>
            {format(new Date(publishedAt), i18n.t('news.dateFormat'))}
          </span>
          <span>{type}</span>
        </header>

        <NextLink href={`/${i18n.t('news.slug')}/${slug}/`}>
          <a>
            <Heading level={3}>{title}</Heading>
          </a>
        </NextLink>

        {excerpt && (
          <p className="font-rubik text-base md:text-medium mt-6">{excerpt}</p>
        )}
      </div>

      <NextLink href={`/${i18n.t('news.slug')}/${slug}/`}>
        <a
          className="absolute top-0 left-0 h-full w-full z-10 opacity-0"
          tabIndex="-1"
          aria-hidden
        >
          <Heading level={3}>{title}</Heading>
        </a>
      </NextLink>

      <span className="col-start-2 col-span-10 h-1 border-b border-gray-300 mt-4 md:mt-12" />
    </article>
  );
}
