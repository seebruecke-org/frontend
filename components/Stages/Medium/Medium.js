import Heading from '@/components/Heading';
import Media from '@/components/Media';

import * as styles from './medium.module.css';

export default function StageMedium({
  kicker,
  title,
  intro,
  image,
  className
}) {
  const hasImage = !!image;

  return (
    <section
      className={`grid grid-layout-primary bg-orange-200 relative ${styles.stage} ${className}`}
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
        className={`col-span-full md:col-start-3 relative bg-orange-200 ${
          hasImage
            ? 'py-12 md:px-12 md:my-40 md:-ml-12 md:col-span-6'
            : 'my-14 md:my-24 md:col-span-9'
        }`}
      >
        <Heading
          level={1}
          kicker={kicker}
          className={`${hasImage ? 'py-5' : 'mb-5'} px-8 md:px-0`}
        >
          {title}
        </Heading>

        {intro && (
          <p className="font-brezel text-base md:text-medium leading-normal px-10 md:px-0">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
