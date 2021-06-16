import { useTranslation } from 'react-i18next';

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
  const paths = await fetchAllCampaignPaths(defaultLocale);

  return {
    fallback: true,
    paths
  };
}

export async function getStaticProps({ locale, params: { slug } }) {
  const { data } = await fetchCampaignBySlug(slug, locale);
  const { initialState, ...globalData } = await queryGlobalData(locale, [
    'news'
  ]);

  if (data === null) {
    return {
      notFound: true
    };
  }

  return {
    // TODO: find a good magic number here
    revalidate: 20,
    props: {
      ...data,
      ...globalData,
      initialState
    }
  };
}
