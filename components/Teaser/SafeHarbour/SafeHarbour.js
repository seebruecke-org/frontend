import { useTranslation } from 'next-i18next';
import NextLink from 'next/link';

export default function SafeHarbourTeaser({ uri, name, since, description }) {
  const { t } = useTranslation('safe-harbour');

  return (
    (<NextLink
      href={uri}
      className="flex flex-col bg-orange-200 hover:bg-orange-800 p-6 md:p-10 h-full">

      <h3>
        <span className="font-rubik text-small md:text-xs italic">
          {since ? `${t('since')} ${since}` : ''}
        </span>
        <span className="font-brezel leading-tight block text-large md:text-medium font-bold italic mt-1 mb-2 md:mb-4">
          {name}
        </span>
      </h3>
      <p className="font-rubik text-small md:text-xs align-self-end mt-auto">
        {description}
      </p>

    </NextLink>)
  );
}
