import hirestime from 'hirestime';

import BlockSwitch from '@/components/BlockSwitch';
import PageBody from '@/components/PageBody';
import SEO from '@/components/SEO';

import { createClient } from '@/lib/api';
import { query as queryGlobalData } from '@/lib/global';
import { getPage } from '@/lib/pages';
import { getSlugFromI18nNext } from '@/lib/slug';
import logger from '@/lib/logger';

export default function NewsOverview({ page }) {
  return (
    <PageBody firstBlock="Richtext" className="spenden-styles">
      <SEO title={page?.title} metadata={page?.metadata} />

      <BlockSwitch blocks={page?.content} />
    </PageBody>
  );
}

export async function getStaticProps({ locale }) {
  const getElapsed = hirestime();
  const client = createClient();
  const { initialState, ...globalData } = await queryGlobalData(
    locale,
    ['donations'],
    { client }
  );
  const { format } = globalData._nextI18Next.initialI18nStore[locale];
  const pageSlug = getSlugFromI18nNext('donations', locale, globalData);
  const [page] = await Promise.all([
    await getPage(pageSlug, null, locale, format, { client }),
  ]);

  logger.info({
    message: 'timing',
    locale,
    path: `${locale}/donations/index`,
    time: getElapsed.seconds()
  });

  return {
    revalidate: 60 * 2,
    props: {
      ...globalData,
      initialState,
      page
    }
  };
}
