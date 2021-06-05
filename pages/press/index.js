import BlockSwitch from '@/components/BlockSwitch';
import NewsTeaser from '@/components/Teaser/NewsEntry';
import SEO from '@/components/SEO';

import { query as queryGlobalData } from '@/lib/global';
import { fetchRecentNews } from '@/lib/news';
import { getPage } from '@/lib/pages';

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
  const { initialState, ...globalData } = await queryGlobalData(locale, [
    'news'
  ]);
  const page = await getPage('presse');
  const news = await fetchRecentNews({ filter: 'pressrelease' });

  return {
    // TODO: find a good magic number here
    revalidate: 20,
    props: {
      ...globalData,
      initialState,
      news,
      page
    }
  };
}
