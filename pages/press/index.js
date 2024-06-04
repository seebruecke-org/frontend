import hirestime from 'hirestime';

import BlockSwitch from '@/components/BlockSwitch';
import SEO from '@/components/SEO';

import { createClient } from '@/lib/api';
import { query as queryGlobalData } from '@/lib/global';
import { fetchPaginatedNews } from '@/lib/news';
import { getPage } from '@/lib/pages';
import { getSlugFromI18nNext } from '@/lib/slug';
import logger from '@/lib/logger';
import { paginatedPress } from './page/[pageNum]';
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

export default function PressOverview({
  news,
  page,
  pagination,
  pageNum,
  locale
}) {
  return (
    <article>
      <SEO title={page?.title} metadata={page?.metadata} />

      <BlockSwitch blocks={page?.content} />

      {paginatedPress(news, pagination, pageNum, locale)}
    </article>
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
  const pageSlug = getSlugFromI18nNext('press', locale, globalData);
  const page = await getPage(pageSlug, null, locale, format, { client });
  const { news, meta } = await fetchPaginatedNews(
    {
      filter: 'pressrelease',
      locale,
      pageNum,
      perPage
    },
    locale,
    format,
    {
      client
    }
  );

  logger.info({
    message: 'timing',
    locale,
    path: `${locale}/press/index`,
    time: getElapsed.seconds()
  });

  return {
    revalidate: 60 * 2,
    props: {
      ...(await serverSideTranslations(locale)),
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
