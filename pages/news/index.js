import hirestime from 'hirestime';

import BlockSwitch from '@/components/BlockSwitch';
import PageBody from '@/components/PageBody';
import SEO from '@/components/SEO';
import logger from '@/lib/logger';

import { createClient } from '@/lib/api';
import { query as queryGlobalData } from '@/lib/global';
import { fetchPaginatedNews } from '@/lib/news';
import { getPage } from '@/lib/pages';
import { getSlugFromI18nNext } from '@/lib/slug';
import { paginatedNews } from './page/[pageNum]';

export default function NewsOverview({ news, page, pagination, pageNum, locale }) {
  return (
    <PageBody firstBlock="Richtext">
      <SEO title={page?.title} metadata={page?.metadata} />

      <BlockSwitch blocks={page?.content} />

      {paginatedNews(news, pagination, pageNum, locale)}
    </PageBody>
  );
}

export async function getStaticProps({ locale }) {
  const perPage = 10;
  const pageNum = 0;

  const getElapsed = hirestime();
  const client = createClient();
  const { initialState, ...globalData } = await queryGlobalData(
    locale,
    ['news'],
    { client }
  );
  const { format } = globalData._nextI18Next.initialI18nStore[locale];
  const pageSlug = getSlugFromI18nNext('news', locale, globalData);
  const [page] = await Promise.all([
    await getPage(pageSlug, null, locale, format, { client }),
  ]);

  const { news, meta } = await fetchPaginatedNews(
    { locale, pageNum, perPage },
    locale,
    format,
    { client }
  );
  logger.info({
    message: 'timing',
    locale,
    path: `${locale}/news/index`,
    time: getElapsed.seconds()
  });
  return {
    revalidate: 60 * 2,
    props: {
      ...globalData,
      initialState,
      news: await news,
      page,
      pageNum,
      pagination: meta.pagination,
      locale
    }
  };
}
