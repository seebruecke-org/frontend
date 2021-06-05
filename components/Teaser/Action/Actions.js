import { useTranslation } from 'next-i18next';
import NextLink from 'next/link';

function Wrapper({ slug, children }) {
  const { t } = useTranslation();

  if (slug) {
    return (
      <NextLink href={`/${t('slugs.action')}/${slug}`}>
        <a className="block bg-turquoise-300 hover:bg-black hover:text-white px-8 py-10 md:p-10 h-full">
          {children}
        </a>
      </NextLink>
    );
  }

  return (
    <div className="bg-turquoise-300 px-7 py-10 md:p-10 h-full">{children}</div>
  );
}

export default function ActionTeaser({ title, meta, intro, slug }) {
  return (
    <Wrapper slug={slug}>
      {meta && (
        <span className="block font-rubik text-small md:text-2xs italic">
          {meta}
        </span>
      )}

      <h2 className="font-brezel text-medium md:text-large font-bold italic leading-tight mt-2">
        {title}
      </h2>

      {intro && (
        <p className="block font-rubik text-small md:text-xs mt-5">{intro}</p>
      )}
    </Wrapper>
  );
}
