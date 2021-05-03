import clsx from 'clsx';

import CTA from '@/components/CTA';
import Heading from '@/components/Heading';
import Media from '@/components/Media';
import StrapiLink from '@/components/StrapiLink';

import { blockNameMatches } from '@/lib/blocks';

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
  uCTA: cta,
  type,
  image,
  reversed = false,
  size = 'small',
  blockContext: { previous, next }
}) {
  const background = getBackgroundColor(type);
  const hasPaddingTop = !blockNameMatches(previous, 'Unterbrecher');
  const hasPaddingBottom = !blockNameMatches(next, 'Unterbrecher');

  return (
    <section
      className={clsx(
        'flex flex-col relative z-10 md:flex-row md:items-center col-span-full',
        hasPaddingTop && 'pt-48 md:pt-24',
        hasPaddingBottom && 'pb-20 md:pb-24',
        !reversed && 'flex-col-reverse md:flex-row-reverse',
        size === 'small' && 'md:col-start-3 md:col-span-9',
        size === 'large' && 'md:col-start-2 md:col-span-12'
      )}
    >
      <div
        className={clsx(
          background,
          styles.contentContainer,
          'flex flex-col justify-center md:min-h-full w-auto md:w-2/4 px-8 md:px-16 py-16 md:py-32 mx-4 md:mx-0 -mt-36 md:mt-0 z-10 relative'
        )}
      >
        <div
          className={clsx(
            background,
            'w-7 absolute h-full z-40 top-0 hidden md:block',
            !reversed ? 'right-full' : 'left-full'
          )}
        />
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
            <CTA link={cta} />
          </div>
        )}
      </div>

      <Media
        image={image}
        layout="fill"
        objectFit="cover"
        className={clsx('block h-full w-full md:w-2/4', styles.square)}
        captionIconClassName={clsx(
          blockNameMatches(next, 'Unterbrecher') && 'bottom-16 left-10',
          !reversed &&
            !blockNameMatches(next, 'Unterbrecher') &&
            'bottom-8 left-8',
          reversed &&
            !blockNameMatches(next, 'Unterbrecher') &&
            'bottom-8 right-8'
        )}
      />

      <StrapiLink
        link={{
          ...cta,
          label: null
        }}
        className="absolute top-0 left-0 w-full h-full opacity-0 z-20"
        aria-label={title.text}
      />
    </section>
  );
}
