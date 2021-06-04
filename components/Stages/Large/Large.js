import dynamic from 'next/dynamic';
import clsx from 'clsx';

import CTA from '@/components/CTA';
import Heading from '@/components/Heading';
import Media from '@/components/Media';

import * as styles from './large.module.css';

const Richtext = dynamic(() => import('@/components/Richtext'));
const SectionNavigation = dynamic(() =>
  import('@/components/SectionNavigation')
);

export default function StageLarge({
  image,
  className,
  heading,
  cta = null,
  subnavigation,
  intro
}) {
  const hasSubnavigation =
    subnavigation && Array.isArray(subnavigation) && subnavigation.length > 0;

  return (
    <div className={clsx('relative mb-40 md:mb-52', styles.stage, className)}>
      <Media
        image={image}
        objectFit="cover"
        layout="fill"
        priority
        className="col-span-full h-full w-full relative md:absolute"
        captionIconClassName="top-4 md:bottom-4 md:top-auto left-2 md:left-4"
      />

      <div
        className={clsx(
          'bg-orange-200 md:w-8/12 absolute -bottom-32 md:-bottom-32 left-2 md:left-auto right-2 md:right-0 w-auto',
          hasSubnavigation ? 'pt-20 md:pt-28' : 'py-20 md:py-28'
        )}
      >
        <div className="max-w-7xl">
          {heading && (
            <Heading
              level={parseInt(heading.level.substr(1), 10)}
              kicker={heading.kicker}
              className="px-8 md:px-20"
            >
              {heading.text}
            </Heading>
          )}

          {intro && (
            <div className="mt-8 md:mt-10 md:px-20">
              <Richtext content={intro} />
            </div>
          )}

          {cta && (
            <div
              className={clsx(
                'px-8 md:px-20 mt-8',
                intro ? 'md:mt-10' : 'md:mt-12'
              )}
            >
              <CTA link={cta} />
            </div>
          )}
        </div>

        {hasSubnavigation && (
          <SectionNavigation
            items={subnavigation}
            primaryGrid={false}
            className="px-8 md:px-20 mt-10 md:mt-20"
          />
        )}
      </div>
    </div>
  );
}
