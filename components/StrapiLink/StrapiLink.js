import Link from 'next/link';

export function parseLink(link) {
  let props = {
    label: null,
    title: null,
    url: null
  };

  try {
    props = JSON.parse(link);
  } catch (err) {
    props.url = null;
  }

  return props;
}

export default function StrapiLink({ link, children, locale, ...props }) {
  const linkProps = parseLink(link);

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
