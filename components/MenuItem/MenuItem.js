import Link from 'next/link';

export default function MenuItem({ path, label, ...props }) {
  return (
    <Link href={path}>
      <a {...props}>
        {label}
      </a>
    </Link>
  )
}
