import { useI18n } from 'next-localization';
import format from 'date-fns/format';

import { getLastBlockName } from '@/lib/blocks';
import { query as queryGlobalData } from '@/lib/global';
import { fetchNewsBySlug, fetchAllNewsPaths } from '@/lib/news';

import BlockSwitch from '@/components/BlockSwitch';
import Heading from '@/components/Blocks/Heading';
import PageBody from '@/components/PageBody';
import SEO from '@/components/SEO';

export default function NewsEntryPage({
  title,
  metadata,
  content,
  publishedAt
}) {
  const i18n = useI18n();
  const date = publishedAt
    ? format(new Date(publishedAt), i18n.t('news.dateFormat'))
    : '';

  return (
    <PageBody firstBlock="Heading" lastBlock={getLastBlockName(content)}>
      <SEO title={title} metadata={metadata} />

      <div className="grid grid-layout-primary">
        <Heading level={1} kicker={date}>
          {title}
        </Heading>
      </div>

      <BlockSwitch blocks={content} />
    </PageBody>
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
