import hirestime from 'hirestime';

import BlockSwitch from '@/components/BlockSwitch';
import NewsTeaser from '@/components/Teaser/NewsEntry';
import PageBody from '@/components/PageBody';
import SEO from '@/components/SEO';

import { query as queryGlobalData } from '@/lib/global';
import { fetchRecentNews } from '@/lib/news';
import { getPage } from '@/lib/pages';
import { getSlugFromI18nNext } from '@/lib/slug';

export default function NewsOverview({ news, page }) {
  return (
    <PageBody firstBlock="Richtext">
      <SEO title={page?.title} metadata={page?.metadata} />

      <BlockSwitch blocks={page?.content} />

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

export async function getStaticProps({ locale }) {
  const getElapsed = hirestime();
  const { initialState, ...globalData } = await queryGlobalData(locale, [
    'news'
  ]);
  const { format } = globalData._nextI18Next.initialI18nStore[locale];
  const pageSlug = getSlugFromI18nNext('news', locale, globalData);
  const [page, news] = await Promise.all([
    await getPage(pageSlug, null, locale, format),
    await fetchRecentNews({ locale }, locale, format)
  ]);

  console.log('Timing: news/index', getElapsed().seconds());

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
