import { forwardRef } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import dynamic from 'next/dynamic';

import Heading from '@/components/Heading';

import * as styles from './medium.module.css';

const Bookmark = dynamic(() => import('@/components/Bookmark'));
const Media = dynamic(() => import('@/components/Media'));

export default forwardRef(function StageMedium(
  { kicker, title, intro, image, layout, className, allowBookmark = false },
  ref
) {
  const hasImage = !!image;
  const { asPath } = useRouter();

  if (layout == "Thumbnail_Image") {
    return (
      <section
        className={clsx(
          'grid grid-layout-primary max-w-full bg-orange-200 relative py-16',
          styles.stage,
          className
        )}
        ref={ref}
      >
        <div className="w-full col-span-full md:col-start-2 md:col-span-11  grid grid-cols-6 gap-16 px-8 md:px-">
          {hasImage && (
            <Media
              image={image}
              priority
              className="w-full col-span-full md:col-start-1 md:col-span-2 md:aspect-square"
            />
          )}

          <div className="col-span-full md:col-start-3 md:col-span-4 relative w-full ">
            <Heading
              level={1}
              kicker={kicker}
              className='mb-16'
            >
              {title}
            </Heading>

            {intro && (
              <p className="p-big ">
                {intro}
              </p>
            )}

            {allowBookmark && <Bookmark name={title} link={asPath}/>}
          </div>

        </div>
      </section>
    );

  }







  if (layout == "Cover_Image") {
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
            className="col-span-full h-72 md:h-full w-full relative md:static"
          />
        )}

        <div
          className={clsx(
            'col-span-full md:col-start-3 relative bg-orange-200 ',
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

          {allowBookmark && <Bookmark name={title} link={asPath}/>}
        </div>
      </section>
    );
  }
});
