import Link from 'next/link';

import * as styles from './cta.module.css';

export default function CTA({ path, label }) {
  return (
    <Link href={path}>
      <a
        className={`font-rubik font-bold text-small md:text-base uppercase bg-white text-black py-4 md:py-6 px-8 md:px-10 rounded-3xl hover:bg-black hover:text-white ${styles.cta}`}
      >
        {label}
      </a>
    </Link>
  );
}
