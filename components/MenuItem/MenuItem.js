import Link from 'next/link';

export default function MenuItem({ path, label, children, locale, ...props }) {
  return (
    <Link href={path} locale={locale}>
      <a {...props}>
        {label}
        {children}
      </a>
    </Link>
  );
}
