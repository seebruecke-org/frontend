import Link from 'next/link';

import * as styles from './cta.module.css';

export default function CTA({ path, label, inverse = false }) {
  return (
    <Link href={path}>
      <a
        className={`font-rubik font-bold text-small md:text-base uppercase ${
          inverse
            ? 'bg-black text-white hover:bg-white hover:text-black'
            : 'bg-white text-black hover:bg-black hover:text-white'
        } py-5 md:py-6 px-8 md:px-10 rounded-3xl  ${styles.cta}`}
      >
        {label}
      </a>
    </Link>
  );
}
