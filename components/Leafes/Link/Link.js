import NextLink from 'next/link';

export default function Link({ href, children, ...props }) {
  return (
    <NextLink>
      <a {...props}>
        {children}
      </a>
    </NextLink>
  )
}
