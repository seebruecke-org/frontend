import Link from 'next/link';

export default function StrapiLink({ link, children, locale, ...props }) {
  let linkProps = link;

  if (!linkProps.url) {
    return (
      <span {...props}>
        {linkProps.label}
        {children}
      </span>
    );
  }

  if (linkProps.url.startsWith('#')) {
    return (
      <a href={linkProps.url.toLowerCase()} {...props}>
        {linkProps.label}
        {children}
      </a>
    );
  }

  return (
    <Link href={linkProps.url.toLowerCase()} locale={locale}>
      <a {...props}>
        {linkProps.label}
        {children}
      </a>
    </Link>
  );
}
