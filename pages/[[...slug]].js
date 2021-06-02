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
                url: t('slugs.news'),
                label: t('news.singleTitle')
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
  const sidePaths = await paths();
  const { slugs } = await import(`@/locales/de/common.json`);

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
  const { slugs } = await import(`@/locales/de/common.json`);
  const normalizedSlug = slug ? slug.map((slug) => slugs[slug] || slug) : slug;
  const { data } = await query(normalizedSlug, locale);
  const { initialState = null, ...globalData } = await queryGlobalData(locale);

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
