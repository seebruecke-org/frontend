import {
  fetchCampaignBySlug,
  fetchAllPaths as fetchAllCampaignPaths
} from '@/lib/campaigns';
import { query as queryGlobalData } from '@/lib/global';

import BlockSwitch from '@/components/BlockSwitch';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageBody from '@/components/PageBody';
import SEO from '@/components/SEO';

import { getFirstBlockName, getLastBlockName } from '@/lib/blocks';

export default function CampaignPage({ content, title }) {
  return (
    <PageBody
      firstBlock={getFirstBlockName(content)}
      lastBlock={getLastBlockName(content)}
    >
      <SEO title={title} />

      <div className="grid grid-layout-primary">
        <Breadcrumbs
          crumbs={[
            {
              path: '/aktuelles',
              label: 'Aktuelles'
            },

            {
              path: '/aktuelles/kampagnen',
              label: 'Kampagnen'
            }
          ]}
        />
      </div>

      <BlockSwitch blocks={content} />
    </PageBody>
  );
}

export async function getStaticPaths() {
  const paths = await fetchAllCampaignPaths();

  return {
    fallback: true,
    paths
  };
}

export async function getStaticProps({ locale, params: { slug } }) {
  const { data } = await fetchCampaignBySlug(slug, locale);
  const { initialState, ...globalData } = await queryGlobalData(locale);

  if (data === null) {
    return {
      notFound: true
    };
  }

  return {
    // TODO: find a good magic number here
    revalidate: 60,
    props: {
      ...data,
      ...globalData,
      initialState
    }
  };
}
