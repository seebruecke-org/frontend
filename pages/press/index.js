import hirestime from 'hirestime';

import BlockSwitch from '@/components/BlockSwitch';
import NewsTeaser from '@/components/Teaser/NewsEntry';
import SEO from '@/components/SEO';

import { createClient } from '@/lib/api';
import { query as queryGlobalData } from '@/lib/global';
import { fetchRecentNews } from '@/lib/news';
import { getPage } from '@/lib/pages';
import { getSlugFromI18nNext } from '@/lib/slug';

export default function PressOverview({ news, page }) {
  return (
    <article>
      <SEO title={page?.title} metadata={page?.metadata} />

      <BlockSwitch blocks={page?.content} />

      <div className="grid grid-layout-primary">
        <ul className="col-span-full pb-20 md:pb-40">
          {news.map((newsEntry) => (
            <li key={newsEntry.id} className="grid grid-layout-primary">
              <NewsTeaser {...newsEntry} />
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export async function getStaticProps({ locale }) {
  const getElapsed = hirestime();
  const client = createClient();
  const { initialState, ...globalData } = await queryGlobalData(
    locale,
    ['news'],
    { client }
  );
  const { format } = globalData._nextI18Next.initialI18nStore[locale];
  const pageSlug = getSlugFromI18nNext('press', locale, globalData);
  const [page, news] = await Promise.all([
    await getPage(pageSlug, null, locale, format, { client }),
    await fetchRecentNews({ filter: 'pressrelease' }, locale, format, {
      client
    })
  ]);

  console.log(`Timing: press/index`, getElapsed.seconds());

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
