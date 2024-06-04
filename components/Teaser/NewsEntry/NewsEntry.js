import { useTranslation } from 'next-i18next';
import clsx from 'clsx';
import NextLink from 'next/link';

import Heading from '@/components/Heading';
import Media from '@/components/Media';

export default function NewsEntry({
  title,
  image,
  publication_date,
  type,
  excerpt = '',
  slug,
  index
}) {
  const { t } = useTranslation('news');
  const { t: ts } = useTranslation('slugs');
  const translatedType = t(`type.${type}`);

  return (
    <article className="grid grid-layout-primary col-span-full pt-12 md:pt-20 px-8 md:px-0 relative group overflow-x-hidden">
      {index > 0 && (
        <span className="col-start-1 md:col-start-2 col-span-full md:col-span-12 h-1 border-b border-gray-300 mb-4 md:mb-12"/>
      )}

      <div className="grid grid-layout-primary gap-8 col-span-full relative">
        {image && (
          <div className="col-span-full md:col-start-2 md:col-span-4">
            <Media
              image={image}
              priority={index < 2}
              sizes="(max-width: 780px) 100vw, 400px"
            />
          </div>
        )}

        <div
          className={clsx(
            'col-span-full w-full',
            image
              ? 'md:col-start-6 md:col-span-8'
              : 'md:col-start-3 md:col-span-11'
          )}
        >
          <header className="font-rubik text-xs md:text-base text-gray-600 mb-1 uppercase flex">
            {publication_date}
            <span className="px-3">·</span>
            {translatedType}
          </header>

          <NextLink href={`/${ts('news')}/${slug}/`} className="group-hover:underline">

            <Heading level={2} as={3}>
              {title}
            </Heading>

          </NextLink>

          {excerpt && (
            <p className="font-rubik text-small md:text-medium mt-6">
              {excerpt}
            </p>
          )}
        </div>

        <NextLink
          href={`/${ts('news')}/${slug}/`}
          className="absolute top-0 left-0 h-full w-full z-10 opacity-0 col-start-2 col-span-12"
          tabIndex="-1"
          aria-hidden>

          <Heading level={3}>{title}</Heading>

        </NextLink>
      </div>
    </article>
  );
}
