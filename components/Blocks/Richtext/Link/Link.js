import NextLink from 'next/link';

import * as styles from './link.module.css';

export default function Link({ href, children, ...props }) {
  return (
    <NextLink href={href}>
      <a
        className={`font-rubik text-base md:text-medium ${styles.link}`}
        {...props}
      >
        {children}
      </a>
    </NextLink>
  );
}
