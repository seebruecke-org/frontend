import Link from 'next/link';

export default function StrapiLink({ link, children, locale, ...props }) {
  let linkProps = {
    label: null,
    title: null,
    url: null
  };

  try {
    linkProps = JSON.parse(link);
  } catch (err) {
    linkProps.url = null;
  }

  if (!linkProps.url) {
    return (
      <span {...props}>
        {linkProps.label || linkProps.title}
        {children}
      </span>
    );
  }

  return (
    <Link href={linkProps.url} locale={locale}>
      <a {...props}>
        {linkProps.label || linkProps.title}
        {children}
      </a>
    </Link>
  );
}
