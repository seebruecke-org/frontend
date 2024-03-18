import hirestime from 'hirestime';

import NewsTeaser from '@/components/Teaser/NewsEntry';
import PageBody from '@/components/PageBody';
import SEO from '@/components/SEO';

import { createClient } from '@/lib/api';
import { query as queryGlobalData } from '@/lib/global';
import { fetchPaginatedNews } from '@/lib/news';
import { getSlugFromI18nNext } from '@/lib/slug';
import logger from '@/lib/logger';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import { getPage } from '@/lib/pages';

export default function NewsOverview({
  news,
  page,
  pageNum,
  pagination,
  locale
}) {
  return (
    <PageBody firstBlock="Richtext">
      <SEO title={page?.title} metadata={page?.metadata} />

      <div className="grid grid-layout-primary">
        <ul className="col-span-full pb-20 md:pb-40">
          {news?.map((newsEntry, index) => (
            <li key={newsEntry.id} className="grid grid-layout-primary">
              <NewsTeaser index={index} {...newsEntry} />
            </li>
          ))}
        </ul>
        <Pagination
          total={pagination?.pageCount}
          current={pageNum}
          linkMaker={localedLinkMaker(locale)}
        />
      </div>
    </PageBody>
  );
}

function localedLinkMaker(locale) {
  return (pageNum, current) => {
    return linkMaker(pageNum, current, locale);
  };
}
function linkMaker(pageNum, current, locale) {
  const cls =
    'font-rubik-features font-rubik leading-tight text-small md:text-medium font-bold py-1 px-4';
  const destination = locale === 'de' ? '/aktuelles/seite/' : '/news/page/';

  return (
    <Link href={`${destination}${pageNum + 1}`}>
      <a className={(current ? 'bg-orange-800 text-white ' : '') + cls}>
        {`${pageNum + 1}`}
      </a>
    </Link>
  );
}

export async function getStaticPaths() {
  return {
    fallback: true,
    paths: [
      {
        params: {
          pageNum: '1'
        }
      }
    ]
  };
}

export async function getStaticProps({ locale, params: { pageNum } }) {
  const perPage = 10;
  const getElapsed = hirestime();
  const client = createClient();
  const { initialState, ...globalData } = await queryGlobalData(
    locale,
    ['news'],
    { client }
  );
  const { format } = globalData._nextI18Next.initialI18nStore[locale];
  const pageSlug = getSlugFromI18nNext('news', locale, globalData);
  const { news, meta } = await fetchPaginatedNews(
    { locale, pageNum, perPage },
    locale,
    format,
    { client }
  );
  const page = await getPage(pageSlug, null, locale, format, { client });

  pageNum = pageNum - 1;
  logger.info({
    message: 'timing',
    locale,
    path: `${locale}/news/index`,
    time: getElapsed.seconds()
  });

  return {
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
