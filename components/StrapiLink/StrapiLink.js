import Link from 'next/link';

export default function StrapiLink({ link, children, locale, ...props }) {
  const { label, title, url } = JSON.parse(link);

  if (!url) {
    return (
      <span {...props}>
        {label || title}
        {children}
      </span>
    );
  }

  return (
    <Link href={url} locale={locale}>
      <a {...props}>
        {label || title}
        {children}
      </a>
    </Link>
  );
}
