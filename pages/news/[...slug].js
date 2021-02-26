import { useI18n } from 'next-localization';
import format from 'date-fns/format';

import { query as queryGlobalData } from '@/lib/global';
import { fetchNewsBySlug, fetchAllNewsPaths } from '@/lib/news';

import BlockSwitch from '@/components/BlockSwitch';
import Heading from '@/components/Heading';
import SEO from '@/components/SEO';

export default function NewsEntryPage({ title, content, publishedAt }) {
  const i18n = useI18n();
  const date = publishedAt
    ? format(new Date(publishedAt), i18n.t('news.dateFormat'))
    : '';

  return (
    <article>
      <SEO title={title} />

      <div className="grid grid-layout-primary">
        <Heading
          level={1}
          kicker={date}
          className="col-span-full md:col-start-3 md:col-span-9 px-10 md:px-0 w-full"
        >
          {title}
        </Heading>
      </div>

      <BlockSwitch blocks={content} />
    </article>
  );
}

export async function getStaticPaths() {
  const paths = await fetchAllNewsPaths();

  return {
    fallback: true,
    paths
  };
}

export async function getStaticProps({ locale, params }) {
  const { slug } = params;

  const { data } = await fetchNewsBySlug(slug[0]);
  const { initialState = null, ...globalData } = await queryGlobalData(locale);

  if (data === null) {
    return {
      notFound: true
    };
  }

  return {
    // TODO: find a good magic number here
    revalidate: 60,
    props: {
      ...data,
      ...globalData,
      initialState
    }
  };
}
