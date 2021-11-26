import { useTranslation } from 'react-i18next';

import { createClient } from '@/lib/api';
import {
  fetchCampaignBySlug,
  fetchAllPaths as fetchAllCampaignPaths
} from '@/lib/campaigns';
import { query as queryGlobalData } from '@/lib/global';

import BlockSwitch from '@/components/BlockSwitch';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageBody from '@/components/PageBody';
import SEO from '@/components/SEO';

import { getLastBlockName } from '@/lib/blocks';

export default function CampaignPage({ content, title, metadata }) {
  const { t } = useTranslation();
  const { t: tn } = useTranslation('news');
  const { t: ts } = useTranslation('slugs');

  return (
    <>
      <SEO metadata={metadata} title={title} />

      <div className="grid grid-layout-primary">
        <Breadcrumbs
          crumbs={[
            {
              url: `/${ts('news')}`,
              label: tn('singleTitle')
            },

            {
              label: t('campaign.pluralTitle')
            }
          ]}
        />
      </div>

      <PageBody lastBlock={getLastBlockName(content)}>
        <BlockSwitch blocks={content} />
      </PageBody>
    </>
  );
}

export async function getStaticPaths({ defaultLocale }) {
  const client = createClient();
  const paths = await fetchAllCampaignPaths(defaultLocale, { client });

  return {
    fallback: true,
    paths
  };
}

export async function getStaticProps({ locale, params: { slug } }) {
  const client = createClient();
  const { initialState, ...globalData } = await queryGlobalData(
    locale,
    ['news'],
    { client }
  );
  const { format } = globalData._nextI18Next.initialI18nStore[locale];
  const { data } = await fetchCampaignBySlug(slug, locale, format, { client });

  if (data === null) {
    return {
      notFound: true,
      revalidate: 10
    };
  }

  return {
    revalidate: 30,
    props: {
      ...data,
      ...globalData,
      initialState
    }
  };
}
