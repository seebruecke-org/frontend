import StrapiLink from '@/components/StrapiLink';

import * as styles from './cta.module.css';

export default function CTA({ link, inverse = false }) {
  return (
    <StrapiLink
      link={link}
      className={`font-rubik font-bold text-small md:text-base uppercase ${
        inverse
          ? 'bg-black text-white hover:bg-white hover:text-black'
          : 'bg-white text-black hover:bg-black hover:text-white'
      } py-5 md:py-6 px-8 md:px-10 rounded-full inline-block text-center ${
        styles.cta
      }`}
    />
  );
}
