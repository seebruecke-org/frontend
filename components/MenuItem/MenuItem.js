import Link from 'next/link';

export default function MenuItem({ path, label, children, locale, ...props }) {
  if (!path) {
    return (
      <span {...props}>
        {label}
        {children}
      </span>
    );
  }

  return (
    <Link href={path} locale={locale}>
      <a {...props}>
        {label}
        {children}
      </a>
    </Link>
  );
}
