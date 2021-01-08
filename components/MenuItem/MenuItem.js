import Link from 'next/link';

export default function MenuItem({ path, label, children, ...props }) {
  return (
    <Link href={path}>
      <a {...props}>
        {label}
        {children}
      </a>
    </Link>
  )
}
