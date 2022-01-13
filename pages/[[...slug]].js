import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import hirestime from 'hirestime';

import { createClient } from '@/lib/api';
import { query as queryGlobalData } from '@/lib/global';
import { query, paths as fetchPagePaths } from '@/lib/pages';
import { getFirstBlockName, getLastBlockName } from '@/lib/blocks';
import { getAllSlugs } from '@/lib/slug';
import logger from '@/lib/logger';

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

export async function getStaticPaths({ locales }) {
  const client = createClient();

  const paths = await Promise.all(
    locales.map(async (locale) => {
      const pagePaths = await fetchPagePaths(locale, { client });
      const slugs = await getAllSlugs(locale);
      return pagePaths
        .map((slug) => {
          if (Object.values(slugs).includes(slug.join('/'))) {
            return null;
          }

          return {
            locale,
            params: {
              slug
            }
          };
        })
        .filter(Boolean);
    })
  );

  return {
    fallback: true,
    paths: paths.flat()
  };
}

export async function getStaticProps({ locale, params: { slug } }) {
  const getElapsed = hirestime();
  const client = createClient();
  const { initialState = null, ...globalData } = await queryGlobalData(
    locale,
    ['news'],
    { client }
  );
  const { format } = globalData._nextI18Next.initialI18nStore[locale];
  const { data } = await query(slug, locale, format, { client });

  if (data === null) {
    logger.error({
      message: '404',
      locale,
      path: `[[...${locale}/${slug || ''}]]`
    });

    return {
      notFound: true,
      revalidate: 30
    };
  }

  logger.info({
    message: 'timing',
    locale,
    path: `[[...${locale}/${slug || ''}]]`,
    time: getElapsed.seconds()
  });

  return {
    revalidate: 60,
    props: {
      ...data,
      ...globalData,
      initialState
    }
  };
}
