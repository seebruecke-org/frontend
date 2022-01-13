import { useTranslation } from 'next-i18next';
import hirestime from 'hirestime';

import { createClient } from '@/lib/api';
import { getLastBlockName } from '@/lib/blocks';
import { query as queryGlobalData } from '@/lib/global';
import { fetchNewsBySlug, fetchAllNewsPaths } from '@/lib/news';
import logger from '@/lib/logger';

import { Image as RichtextBlockImage } from '@/components/Richtext';
import BlockSwitch from '@/components/BlockSwitch';
import Heading from '@/components/Blocks/Heading';
import PageBody from '@/components/PageBody';
import SEO from '@/components/SEO';

export default function NewsEntryPage({
  title,
  metadata,
  content,
  image,
  published_at,
  type
}) {
  const { t } = useTranslation('news');

  return (
    <>
      <SEO title={title} metadata={metadata} />

      <PageBody lastBlock={getLastBlockName(content)}>
        <div className="grid grid-layout-primary">
          <Heading level={1} kicker={`${published_at} · ${t(`type.${type}`)}`}>
            {title}
          </Heading>
        </div>

        <BlockSwitch
          blocks={content}
          blockProps={{
            Richtext: {
              renderers: {
                // eslint-disable-next-line react/display-name
                image: ({ src, alt }) => {
                  return (
                    <RichtextBlockImage
                      image={{
                        caption: image?.caption || image?.media?.caption,
                        media: {
                          url: src,
                          width: 270,
                          height: 270,
                          alternativeText: alt
                        }
                      }}
                      priority
                      className="md:float-left md:mr-12 mb-10 md:-ml-16 xl:-ml-48 md:mt-4"
                    />
                  );
                }
              }
            }
          }}
        />
      </PageBody>
    </>
  );
}

export async function getStaticPaths({ defaultLocale }) {
  const client = createClient();
  const paths = await fetchAllNewsPaths(defaultLocale, { client });

  return {
    fallback: true,
    paths
  };
}

export async function getStaticProps({ locale, params: { slug } }) {
  const getElapsed = hirestime();
  const client = createClient();
  const { initialState = null, ...globalData } = await queryGlobalData(
    locale,
    ['news'],
    { client }
  );
  const { format } = globalData._nextI18Next.initialI18nStore[locale];
  const { data } = await fetchNewsBySlug(slug, locale, format, { client });

  if (data === null) {
    logger.error({
      message: '404',
      locale,
      path: `${locale}/news/[${slug}]`
    });

    return {
      notFound: true,
      revalidate: 10
    };
  }

  logger.info({
    message: 'timing',
    locale,
    path: `${locale}/news/[${slug}]`,
    time: getElapsed.seconds()
  });

  return {
    revalidate: 60 * 5,
    props: {
      ...data,
      ...globalData,
      initialState
    }
  };
}
