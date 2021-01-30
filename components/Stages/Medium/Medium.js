import Heading from '@/components/Heading';
import Image from '@/components/Image';

import * as styles from './medium.module.css';

export default function StageMedium({
  kicker,
  title,
  intro,
  image,
  className
}) {
  return (
    <section
      className={`grid grid-layout-primary bg-orange-200 relative ${styles.stage} ${className}`}
    >
      {image && (
        <Image
          image={image}
          objectFit="cover"
          layout="fill"
          className="col-span-full h-96 md:h-full w-full relative md:static"
        />
      )}

      <div
        className={`col-span-full md:col-start-3 relative bg-orange-200 ${
          image
            ? 'py-12 md:px-12 md:my-40 md:-ml-12 md:col-span-6'
            : 'my-12 md:my-24 md:col-span-9'
        }`}
      >
        <Heading
          level={1}
          kicker={kicker}
          className={`${image ? 'py-5' : 'mb-5'} px-10 md:px-0`}
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
