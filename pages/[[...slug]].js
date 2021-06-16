import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';

import { query as queryGlobalData } from '@/lib/global';
import { query, paths } from '@/lib/pages';
import { getFirstBlockName, getLastBlockName } from '@/lib/blocks';

import BlockSwitch from '@/components/BlockSwitch';
import PageBody from '@/components/PageBody';
import SEO from '@/components/SEO';

const Breadcrumbs = dynamic(() => import('@/components/Breadcrumbs'));

export default function GenericPage({ page }) {
  const { t } = useTranslation();
  const { t: tn } = useTranslation('news');
  const { t: ts } = useTranslation('slugs');
  const hasCampaign = !!page?.campaign;

  return (
    <PageBody
      firstBlock={getFirstBlockName(page?.content)}
      lastBlock={getLastBlockName(page?.content)}
    >
      <SEO title={page?.title} metadata={page?.metadata} />

      {hasCampaign && (
        <div className="grid grid-layout-primary">
          <Breadcrumbs
            crumbs={[
              {
                url: ts('news'),
                label: tn('singleTitle')
              },

              {
                label: t('campaign.pluralTitle')
              }
            ]}
          />
        </div>
      )}

      <BlockSwitch blocks={page?.content} />
    </PageBody>
  );
}

export async function getStaticPaths({ defaultLocale }) {
  const sidePaths = await paths(defaultLocale);
  const slugs = await import(`@/locales/de/slugs.json`);

  const customPages = Object.values(slugs);

  const staticPaths = sidePaths
    .map((slug) => {
      if (customPages.includes(slug.join('/'))) {
        return null;
      }

      return {
        locale: defaultLocale,
        params: {
          slug
        }
      };
    })
    .filter(Boolean);

  return {
    fallback: true,
    paths: staticPaths
  };
}

export async function getStaticProps({ locale, params: { slug } }) {
  const { data } = await query(slug, locale);
  const { initialState = null, ...globalData } = await queryGlobalData(locale, [
    'news'
  ]);

  if (data === null) {
    return {
      notFound: true
    };
  }

  return {
    revalidate: 20,
    props: {
      ...data,
      ...globalData,
      initialState
    }
  };
}
