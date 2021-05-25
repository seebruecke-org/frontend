import clsx from 'clsx';

import StrapiLink from '@/components/StrapiLink';

import * as styles from './cta.module.css';

export default function CTA({ link, inverse = false, className }) {
  return (
    <StrapiLink
      link={link}
      className={clsx(
        className,
        'font-rubik font-bold text-small md:text-base uppercase py-4 sm:py-5 md:py-6 px-7 sm:px-8 md:px-10 rounded-full inline-block text-center',
        inverse
          ? 'bg-black text-white hover:bg-white hover:text-black'
          : 'bg-white text-black hover:bg-black hover:text-white',
        styles.cta
      )}
    />
  );
}
