import { useTranslation } from 'next-i18next';
import format from 'date-fns/format';

import { getLastBlockName } from '@/lib/blocks';
import { query as queryGlobalData } from '@/lib/global';
import { fetchNewsBySlug, fetchAllNewsPaths } from '@/lib/news';

import BlockSwitch from '@/components/BlockSwitch';
import Breadcrumbs from '@/components/Breadcrumbs';
import Heading from '@/components/Blocks/Heading';
import PageBody from '@/components/PageBody';
import SEO from '@/components/SEO';

export default function NewsEntryPage({
  title,
  metadata,
  content,
  publishedAt,
  type
}) {
  const { t } = useTranslation();
  const date = publishedAt
    ? format(new Date(publishedAt), t('news.dateFormat'))
    : '';

  return (
    <PageBody firstBlock="Heading" lastBlock={getLastBlockName(content)}>
      <SEO title={title} metadata={metadata} />

      <div className="grid grid-layout-primary">
        {type !== 'news' && (
          <Breadcrumbs
            crumbs={[
              {
                url: `/${t('slugs.press')}`,
                label: t('press.longTitle')
              }
            ]}
          />
        )}

        <Heading level={1} kicker={`${date} · ${t(`news.type.${type}`)}`}>
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

export async function getStaticProps({ locale, params: { slug } }) {
  const { data } = await fetchNewsBySlug(slug);
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
