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

export default function FederalCountry({
  name,
  count,
  singularKicker,
  pluralKicker,
  uri
}) {
  return (
    <LinkWrapper uri={uri}>
      <h3 className="font-brezel text-xl font-bold italic leading-none px-5 py-10">
        <small className="block not-italic font-rubik font-normal text-small mb-4">
          {count} {count === 1 ? singularKicker : pluralKicker}
        </small>

        <span className={`${uri && 'underline group-hover:text-orange-800'}`}>
          {name}
        </span>
      </h3>
    </LinkWrapper>
  );
}
