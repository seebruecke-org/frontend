import { useI18n } from 'next-localization';
import NextLink from 'next/link';

export default function ActionTeaser({ title, meta, intro, slug }) {
  const i18n = useI18n();

  return (
    <NextLink href={`/${i18n.t('action.slug')}/${slug}`}>
      <a className="block bg-turquoise-300 hover:bg-black hover:text-white p-10 h-full">
        {meta && (
          <span className="block font-rubik text-small md:text-2xs italic">
            {meta}
          </span>
        )}

        <h2 className="font-brezel text-medium font-bold italic leading-tight mt-2">
          {title}
        </h2>

        {intro && (
          <p className="block font-rubik text-small md:text-xs mt-5">{intro}</p>
        )}
      </a>
    </NextLink>
  );
}
