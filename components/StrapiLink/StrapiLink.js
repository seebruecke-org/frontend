import { forwardRef } from 'react';
import Link from 'next/link';

function StrapiLink({ link, children, locale, ...props }, ref) {
  let linkProps = link;
  if (linkProps.locale !== "context") {
    locale = linkProps.locale;
  }
  if (!linkProps.url) {
    return (
      <span {...props} ref={ref}>
        {linkProps.label}
        {children}
      </span>
    );
  }

  if (linkProps.url.startsWith('#')) {
    return (
      <a href={linkProps.url} {...props} ref={ref}>
        {linkProps.label}
        {children}
      </a>
    );
  }

  return (
    <Link href={linkProps.url} locale={locale} {...props} ref={ref}>
        {linkProps.label}
        {children}
    </Link>
  );
}

export default forwardRef(StrapiLink);
