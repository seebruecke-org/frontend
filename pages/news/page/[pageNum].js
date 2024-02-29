import hirestime from 'hirestime';

import BlockSwitch from '@/components/BlockSwitch';
import NewsTeaser from '@/components/Teaser/NewsEntry';
import PageBody from '@/components/PageBody';
import SEO from '@/components/SEO';

import { createClient } from '@/lib/api';
import { query as queryGlobalData } from '@/lib/global';
import { fetchPaginatedNews } from '@/lib/news';
import { getPage } from '@/lib/pages';
import { getSlugFromI18nNext } from '@/lib/slug';
import logger from '@/lib/logger';

export default function NewsOverview({ news, page }) {
  return (
    <PageBody firstBlock="Richtext">
      <SEO title={page?.title} metadata={page?.metadata} />

      <div className="grid grid-layout-primary">
        <ul className="col-span-full pb-20 md:pb-40">
          {news.map((newsEntry, index) => (
            <li key={newsEntry.id} className="grid grid-layout-primary">
              <NewsTeaser index={index} {...newsEntry} />
            </li>
          ))}
        </ul>
      </div>
    </PageBody>
  );
}

export async function getStaticPaths(){
  return {
    paths: [
      {
        params: {
          pageNum: '1',
        },
      }, // See the "paths" section below
    ],
    fallback: true, // false or "blocking"
  }
}
export async function getStaticProps({ locale, pageNum }) {
  console.log(pageNum)
  console.log("AAAA")
  const getElapsed = hirestime();
  const client = createClient();
  const { initialState, ...globalData } = await queryGlobalData(
    locale,
    ['news'],
    { client }
  );
  const { format } = globalData._nextI18Next.initialI18nStore[locale];
  const pageSlug = getSlugFromI18nNext('news', locale, globalData);
  const [page, news] = await Promise.all([
    await getPage(pageSlug, null, locale, format, { client }),
    await fetchPaginatedNews({ locale }, locale, format, { client })
  ]);

  console.log(news)
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
      news,
      page
    }
  };
}
