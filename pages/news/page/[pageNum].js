import hirestime from 'hirestime';

import NewsTeaser from '@/components/Teaser/NewsEntry';
import PageBody from '@/components/PageBody';
import SEO from '@/components/SEO';

import {createClient} from '@/lib/api';
import {query as queryGlobalData} from '@/lib/global';
import {fetchPaginatedNews} from '@/lib/news';
import {getSlugFromI18nNext} from '@/lib/slug';
import logger from '@/lib/logger';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import {getPage} from '@/lib/pages';
import clsx from "clsx";

export function paginatedNews(news, pagination, pageNum, locale) {
  return (
    <div className="grid grid-layout-primary">
      <ul className="col-span-full pb-20 md:pb-40">
        {news?.map((newsEntry, index) => (<li key={newsEntry.id} className="grid grid-layout-primary">
          <NewsTeaser index={index} {...newsEntry} />
        </li>))}
      </ul>
      <Pagination
        total={pagination?.pageCount}
        current={pageNum}
        locale={locale}
        urlMaker={urlMaker}
      />
    </div>
  );
}

export default function NewsOverview({news, page, pageNum, pagination, locale}) {
  return (<PageBody firstBlock="Richtext">
    <SEO title={page?.title} metadata={page?.metadata}/>

    {paginatedNews(news, pagination, pageNum, locale, urlMaker)}
  </PageBody>);
}

function urlMaker(pageNum, locale) {
  const destination = locale === 'de' ? '/aktuelles/seite/' : '/news/page/';
  return `${destination}${pageNum + 1}`;
}

export async function getStaticPaths() {
  return {
    fallback: true, paths: [{
      params: {
        pageNum: '1'
      }
    }]
  };
}

export async function getStaticProps({locale, params: {pageNum}}) {
  const perPage = 10;
  const getElapsed = hirestime();
  const client = createClient();
  const {initialState, ...globalData} = await queryGlobalData(locale, ['news'], {client});
  const {format} = globalData._nextI18Next.initialI18nStore[locale];
  const pageSlug = getSlugFromI18nNext('news', locale, globalData);
  const {news, meta} = await fetchPaginatedNews({locale, pageNum, perPage}, locale, format, {client});
  const page = await getPage(pageSlug, null, locale, format, {client});

  pageNum = pageNum - 1;
  logger.info({
    message: 'timing', locale, path: `${locale}/news/index`, time: getElapsed.seconds()
  });

  return {
    props: {
      ...globalData, initialState, news: await news, page, pageNum, pagination: meta.pagination, locale
    }
  };
}
