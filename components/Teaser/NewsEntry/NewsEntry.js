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
    <NextLink href={`/${i18n.t('news.slug')}/${slug}/`}>
      <a className="block">
        <article className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-gray-300 pb-10 pt-10">
          {image && (
            <div className="col-span-full md:col-start-1 md:col-span-4">
              <Image image={image.image} />
            </div>
          )}

          <div
            className={`col-span-full ${
              image
                ? 'md:col-start-5 md:col-span-8'
                : 'md:col-start-2 md:col-span-11'
            }`}
          >
            <header className="font-rubik text-xs text-gray-600 flex space-x-8">
              <span>
                {format(new Date(publishedAt), i18n.t('news.dateFormat'))}
              </span>
              <span>{type}</span>
            </header>
            <Heading level={3}>{title}</Heading>

            <p>{excerpt}</p>
          </div>
        </article>
      </a>
    </NextLink>
  );
}
