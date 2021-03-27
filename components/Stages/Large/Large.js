import CTA from '@/components/CTA';
import Heading from '@/components/Heading';
import Media from '@/components/Media';
import SectionNavigation from '@/components/SectionNavigation';

import * as styles from './large.module.css';

export default function StageLarge({
  media,
  className,
  title,
  cta = null,
  subnavigation
}) {
  const hasSubnavigation =
    subnavigation && Array.isArray(subnavigation) && subnavigation.length > 0;

  return (
    <div className={`relative mb-40 md:mb-52 ${styles.stage} ${className}`}>
      <Media
        media={media}
        objectFit="cover"
        layout="fill"
        priority
        className="col-span-full h-full w-full relative md:absolute"
      />

      <div
        className={`bg-orange-200 ${
          hasSubnavigation ? 'pt-20 md:pt-28' : 'py-20 md:py-28'
        } md:w-8/12 absolute -bottom-48 md:-bottom-32 left-8 md:left-auto right-8 md:right-0 w-auto`}
      >
        <div className="max-w-6xl px-8 md:px-20">
          <Heading kicker="Kampagne" level={1}>
            {title}
          </Heading>

          {cta && (
            <div className="mt-12">
              <CTA {...cta} />
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
