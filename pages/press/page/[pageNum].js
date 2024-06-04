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
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

export function paginatedPress(news, pagination, pageNum, locale) {
  return (


    <div className="grid grid-layout-primary">
      <ul className="col-span-full pb-20 md:pb-40">
        {news?.map((newsEntry, index) => (
          <li key={newsEntry.id} className="grid grid-layout-primary">
          <NewsTeaser {...newsEntry} />
        </li>))}
      </ul>


      <Pagination
        total={pagination?.pageCount}
        current={pageNum}
        locale={locale}
        urlMaker={urlMaker}
        bigStep={3}
      />
    </div>
  )
    ;
}

export default function NewsOverview({news, page, pageNum, pagination, locale}) {
  return (<PageBody firstBlock="Richtext">
    <SEO title={page?.title} metadata={page?.metadata}/>
    <div className="grid grid-layout-primary">

      <h1 id="pressemitteilungen"
          className="mb-24 font-rubik-features max-w-full font-brezel leading-none text-2xl md:text-4xl font-bold italic break-words sm:break-normal tracking-tight px-8 md:px-0 col-span-full md:col-start-3 md:col-span-9 pt-14 md:pt-24">
        <small
          className="font-brezel italic text-base md:text-medium block mb-2  font-normal leading-none tracking-normal"><span>Neues von der Seebrücke</span><span
          className="sr-only">:</span></small><span>Pressemitteilungen</span></h1>
    </div>
      {paginatedPress(news, pagination, pageNum, locale, urlMaker)}
  </PageBody>
);
}

function urlMaker(pageNum, locale) {
  const destination = locale === 'de' ? '/presse/seite/' : '/press/page/';
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
  const pageSlug = getSlugFromI18nNext('press', locale, globalData);
  const {news, meta} = await fetchPaginatedNews({filter: 'pressrelease', locale, pageNum, perPage}, locale, format, {client});
  const page = await getPage(pageSlug, null, locale, format, {client});

  pageNum = pageNum - 1;
  logger.info({
    message: 'timing',
    locale,
    path: `${locale}/news/index`,
    time: getElapsed.seconds()
  });

  return {
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
