import clsx from 'clsx';
import Link from 'next/link';

function Wrapper({ uri = null, className, children }) {
  const cssClassName = clsx('w-8 h-auto block cursor-pointer', className);

  if (uri) {
    return (
      <Link href={uri}>
        <a className={cssClassName}>{children}</a>
      </Link>
    );
  }

  return <div className={cssClassName}>{children}</div>;
}

export default function Marker({ children, ...props }) {
  return <Wrapper {...props}>{children}</Wrapper>;
}
