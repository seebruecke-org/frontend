import clsx from 'clsx';
import Link from 'next/link';

function LinkWrapper({ children, uri }) {
  if (!uri) {
    return children;
  }

  return (
    <Link href={uri}>
      <a className="group">{children}</a>
    </Link>
  );
}

export default function Country({ name, uri }) {
  return (
    <LinkWrapper uri={uri}>
      <h2 className="font-brezel text-medium font-light italic leading-none px-5 py-10 text-gray-600 relative text-center">
        <span className="absolute top-2/4 left-0 w-full h-1 border-t border-gray-600" />
        <span
          className={clsx(
            'bg-white relative px-16',
            uri && 'underline group-hover:text-orange-800'
          )}
        >
          {name}
        </span>
      </h2>
    </LinkWrapper>
  );
}
