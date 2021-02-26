import Link from 'next/link';

import CTA from '@/components/CTA';
import Heading from '@/components/Heading';
import Image from '@/components/Image';

import * as styles from './unterbrecher.module.css';

function getBackgroundColor(type) {
  switch (type) {
    case 'action':
      return 'bg-turquoise-300 text-black';

    case 'campaign':
      return 'bg-orange-200 text-black';
  }

  return 'bg-orange-800 text-white';
}

export default function Unterbrecher({
  uTitle: title,
  intro,
  uCta: cta,
  type,
  uMedia: media,
  reversed = false,
  size = 'small',
  blockContext: { previous, next }
}) {
  const background = getBackgroundColor(type);
  const hasPaddingTop = previous !== 'ComponentSharedBlocksUnterbrecher';
  const hasPaddingBottom = next !== 'ComponentSharedBlocksUnterbrecher';

  return (
    <section
      className={`flex flex-col ${hasPaddingTop && 'pt-24 relative z-10'} ${
        hasPaddingBottom && 'pb-24'
      } ${
        reversed && 'flex-col-reverse md:flex-row-reverse'
      } md:flex-row md:items-center col-span-full ${
        size === 'small' && 'md:col-start-3 md:col-span-9'
      } ${size === 'large' && 'md:col-start-2 md:col-span-12'}`}
    >
      <div
        className={`${background} ${styles.contentContainer} flex flex-col justify-center md:min-h-full w-full md:w-2/4 px-10 md:px-16 py-32`}
      >
        <Heading as={1} kicker={title?.kicker} level={title.level}>
          {title.text}
        </Heading>

        {intro && (
          <p className="font-brezel text-base md:text-medium leading-tight mt-5">
            {intro}
          </p>
        )}

        {cta && (
          <div className="mt-12 md:mt-16">
            <CTA {...cta} />
          </div>
        )}
      </div>

      <Link href={cta.path}>
        <a className="block w-full h-full md:w-2/4 px-6 md:px-0">
          <div className={`block h-full relative ${styles.square}`}>
            <Image
              image={media}
              layout="fill"
              objectFit="cover"
              className="h-full absolute top-2/4 transform -translate-y-2/4 left-0 w-full"
              classNameImage={`flex ${
                reversed ? 'justify-end' : 'justify-start'
              }`}
            />
          </div>
        </a>
      </Link>
    </section>
  );
}
