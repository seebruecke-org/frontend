import CTA from '@/components/CTA';
import Heading from '@/components/Heading';
import Image from '@/components/Image';

import * as styles from './large.module.css';

export default function StageLarge({ image, className, title, cta = null }) {
  return (
    <div className={`relative mb-32 md:mb-52 ${styles.stage} ${className}`}>
      <Image
        image={image}
        objectFit="cover"
        layout="fill"
        className="col-span-full h-full w-full relative md:absolute"
      />

      <div className="bg-orange-200 py-10 md:py-20 px-8 md:px-20 md:w-8/12 absolute -bottom-20 md:-bottom-32 left-4 md:left-auto right-4 md:right-0">
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
