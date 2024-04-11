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
  const prevIsUntercher = blockNameMatches(previous, 'Unterbrecher');
  const nextIsUnterbrecher = blockNameMatches(next, 'Unterbrecher');

  return (
    <section
      className={clsx(
        'flex flex-col-reverse relative z-10 md:flex-row md:items-center col-span-full',
        !prevIsUntercher && 'pt-8 md:pt-24',
        !nextIsUnterbrecher && 'pb-8 md:pb-24',
        !reversed && 'md:flex-row-reverse',
        size === 'small' && 'md:col-start-3 md:col-span-9',
        size === 'large' && 'md:col-start-2 md:col-span-12'
      )}
    >
      <div
        className={clsx(
          background,
          styles.contentContainer,
          'flex flex-col justify-center md:min-h-full w-auto md:w-2/4 px-8 md:px-16 py-16 md:py-32 mx-2 sm:mx-4 md:mx-0 z-10 relative',
          !nextIsUnterbrecher && reversed ? '-mt-80 md:mb-0' : '-mt-80 md:mt-0'
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
            <CTA link={cta} rel="nofollow" className="relative z-30" />
          </div>
        )}
      </div>

      <Media
        image={image}
        layout="fill"
        objectFit="cover"
        sizes="(max-width: 780px) 100vw, 570px"
        className={clsx('block h-full w-full md:w-2/4', styles.square)}
        captionIconClassName={clsx(
          blockNameMatches(next, 'Unterbrecher') &&
            'top-4 md:top-auto left-4 md:left-auto md:bottom-16 md:left-10',
          !reversed &&
            !blockNameMatches(next, 'Unterbrecher') &&
            'top-4 md:top-auto md:bottom-8 left-4 md:left-8',
          reversed &&
            !blockNameMatches(next, 'Unterbrecher') &&
            'top-4 md:bottom-8 left-4 md:left-auto md:right-8'
        )}
      />

      <StrapiLink
        link={{
          ...cta,
          label: null
        }}
        className="absolute top-0 left-0 w-full h-full opacity-0 z-20"
        aria-label={title.text}
        tabindex="-1"
        aria-hidden="true"
      />
    </section>
  );
}
