import CTA from '@/components/CTA';
import Heading from '@/components/Heading';
import Image from '@/components/Image';

import * as styles from './large.module.css';

export default function StageLarge({ image, className, title, cta = null }) {
  return (
    <div className={`relative mb-40 md:mb-52 ${styles.stage} ${className}`}>
      <Image
        image={image}
        objectFit="cover"
        layout="fill"
        className="col-span-full h-full w-full relative md:absolute"
      />

      <div className="bg-orange-200 py-20 md:py-28 px-8 md:px-20 md:w-8/12 absolute -bottom-48 md:-bottom-32 left-8 md:left-auto right-8 md:right-0 w-auto">
        <div className="max-w-6xl">
          <Heading kicker="Kampagne" level={1}>
            {title}
          </Heading>

          {cta && (
            <div className="mt-12">
              <CTA {...cta} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
