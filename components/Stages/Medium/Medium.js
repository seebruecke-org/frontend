import { useTranslation } from 'next-i18next';
import { forwardRef } from 'react';
import clsx from 'clsx';

import Bookmark from '@/components/Bookmark';
import Heading from '@/components/Heading';
import Media from '@/components/Media';

import * as styles from './medium.module.css';

export default forwardRef(function StageMedium(
  { kicker, title, intro, image, className, allowBookmark = false },
  ref
) {
  const { t } = useTranslation();
  const hasImage = !!image;

  return (
    <section
      className={clsx(
        'grid grid-layout-primary bg-orange-200 relative',
        styles.stage,
        className
      )}
      ref={ref}
    >
      {hasImage && (
        <Media
          image={image}
          objectFit="cover"
          layout="fill"
          priority
          className="col-span-full h-96 md:h-full w-full relative md:static"
        />
      )}

      <div
        className={clsx(
          'col-span-full md:col-start-3 relative bg-orange-200',
          hasImage
            ? 'py-12 md:px-12 md:my-40 md:-ml-12 md:col-span-6'
            : 'my-14 md:my-24 md:col-span-9'
        )}
      >
        <Heading
          level={1}
          kicker={kicker}
          className={clsx(hasImage ? 'py-5' : 'mb-5', 'px-8 md:px-0')}
        >
          {title}
        </Heading>

        {intro && (
          <p className="font-brezel text-base md:text-medium leading-normal px-10 md:px-0">
            {intro}
          </p>
        )}

        {allowBookmark && <Bookmark label={t('city.bookmark_place')} />}
      </div>
    </section>
  );
});
