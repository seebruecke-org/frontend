import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

import { query as queryGlobalData } from '@/lib/global';
import Heading from '@/components/Blocks/Heading';
import PageBody from '@/components/PageBody';
import SEO from '@/components/SEO';

export default function SearchPage() {
  const { query } = useRouter();
  const { t } = useTranslation();

  return (
    <PageBody className="grid grid-layout-primary">
      <SEO
        title={`${t('search.title')} ${query?.query && '—'} ${query?.query}`}
      />

      <Heading level={1}>In Arbeit ...</Heading>
    </PageBody>
  );
}

export async function getStaticProps({ locale }) {
  const { initialState = null, ...globalData } = await queryGlobalData(locale);

  return {
    props: {
      ...globalData,
      initialState
    }
  };
}
