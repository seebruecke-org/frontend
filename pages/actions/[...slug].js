import { useTranslation } from 'next-i18next';
import hirestime from 'hirestime';

import { createClient } from '@/lib/api';
import { fetchLatestActionPaths } from '@/lib/actions';
import { query as queryGlobalData } from '@/lib/global';
import { fetchActionBySlug } from '@/lib/actions';
import logger from '@/lib/logger';

import Action from '@/components/Teaser/Action';
import BlockSwitch from '@/components/BlockSwitch';
import Group from '@/components/Teaser/Group';
import Heading from '@/components/Blocks/Heading';
import PageBody from '@/components/PageBody';
import SEO from '@/components/SEO';

export default function ActionPage({
  title,
  metadata,
  content,
  formattedDateRange,
  location,
  location_detail,
  group
}) {
  const { t } = useTranslation();

  const full_location = location_detail ? location + ', ' + location_detail : location;

  return (
    <PageBody firstBlock="Heading">
      <SEO title={title} metadata={metadata} />

      <div className="grid grid-layout-primary">
        <Heading level={1}>{title}</Heading>

        <div className="col-span-full md:col-start-3 md:col-span-7 mt-20 px-1 md:px-0">
          <Action
            title={formattedDateRange}
            intro={full_location}
          />
        </div>
      </div>

      <BlockSwitch blocks={content} />

      {group && group?.city && (
        <div className="grid grid-layout-primary">
          <Heading level={2} as={4}>
            {t('action.organizedBy')}
          </Heading>

          <div className="col-span-full md:col-start-3 md:col-span-5 px-10 md:px-0 mt-20 mb-20">
            <Group {...group.city} />
          </div>
        </div>
      )}
    </PageBody>
  );
}

export async function getStaticPaths({ defautLocale }) {
  const client = createClient();
  const paths = []
  //await fetchAllActionPaths(defautLocale, { client });

  return {
    fallback: true,
    paths
  };
}

export async function getStaticProps({ locale, params: { slug } }) {
  const client = createClient();
  const getElapsed = hirestime();
  const { initialState = null, ...globalData } = await queryGlobalData(
    locale,
    [],
    { client }
  );
  const { format } = globalData._nextI18Next.initialI18nStore[locale];
  const { data } = await fetchActionBySlug(slug, locale, format, { client });

  if (data === null) {
    logger.error({
      message: '404',
      locale,
      path: `${locale}/actions/[${slug}]`
    });

    return {
      notFound: true,
      revalidate: 10
    };
  }

  logger.info({
    message: 'timing',
    locale,
    path: `${locale}/actions/[${slug}]`,
    time: getElapsed.seconds()
  });

  return {
    revalidate: 60 * 30,
    props: {
      ...data,
      ...globalData,
      initialState
    }
  };
}
