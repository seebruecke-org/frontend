import Link from 'next/link';

export default function MenuItem({
  path,
  label,
  children,
  locale,
  scroll = true,
  ...props
}) {
  if (!path) {
    return (
      <span {...props}>
        {label}
        {children}
      </span>
    );
  }

  return (
    <Link href={path} locale={locale} scroll={scroll}>
      <a {...props}>
        {label}
        {children}
      </a>
    </Link>
  );
}
