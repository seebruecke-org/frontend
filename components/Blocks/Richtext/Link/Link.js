import NextLink from 'next/link';

export default function Link({ href, children, ...props }) {
  return (
    <NextLink href={href}>
      <a className="underline" {...props}>
        {children}
      </a>
    </NextLink>
  );
}
