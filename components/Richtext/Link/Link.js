import clsx from 'clsx'
import NextLink from 'next/link'

import { isInternal } from '@/lib/link'

import * as styles from './link.module.css'

function getRelativeURL(href) {
  if (!isInternal(href)) {
    const { pathname, hash } = new URL(href)

    return `${pathname}${hash}`
  }

  return href
}

export default function Link({ href, children, className = '', ...props }) {
  return (
    <NextLink
      href={getRelativeURL(href)}
      className={clsx(
        'font-rubik text-base md:text-medium',
        className,
        styles.link
      )}
      {...props}
    >
      {children}
    </NextLink>
  )
}
