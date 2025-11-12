import { useRef, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import hirestime from 'hirestime';

import { createClient } from '@/lib/api';
import { BLOCK_PREFIX } from '@/lib/constants';
import { getPage } from '@/lib/pages';
import { fetchAllGroups } from '@/lib/take-part';
import { query as queryGlobalData } from '@/lib/global';
import { getFirstBlockName, getLastBlockName } from '@/lib/blocks';
import { getSlugFromI18nNext } from '@/lib/slug';
import useCityFilter from '@/lib/hooks/useCityFilter';
import logger from '@/lib/logger';

import BlockSwitch from '@/components/BlockSwitch';
import Form from '@/components/Form';
import PageBody from '@/components/PageBody';
import Row from '@/components/Form/Row';
import SEO from '@/components/SEO';
import TextInput from '@/components/Form/TextInput';
import MapList from '@/components/MapList';

const Map = dynamic(() => import('@/components/Map'));

const ALLOWED_BLOCKS_TOP = [
  'Heading',
  'Richtext',
  'StageMedium',
  'SubNavigation'
];

export default function TakePartOverview({ cities: defaultCities, page }) {
  const { t } = useTranslation('group');
  const { cities, filter, setFilter } = useCityFilter(defaultCities);

  // Transform cities into flat map data for the Map component
  const mapCities = useMemo(() => {
    if (!cities) return [];

    return cities
      .map((country) => (country?.federalCountries || []).map((fc) => fc?.cities || []).flat())
      .flat();
  }, [cities]);

  const indexFirstBottomBlock = page?.content?.findIndex(
    ({ __typename }) =>
      !ALLOWED_BLOCKS_TOP.includes(__typename.replace(BLOCK_PREFIX, ''))
  );
  let topBlocks = page?.content;
  let bottomBlocks = null;

  if (indexFirstBottomBlock !== -1) {
    topBlocks = page?.content?.slice(0, indexFirstBottomBlock);
    bottomBlocks = page?.content?.slice(
      indexFirstBottomBlock,
      page?.content?.length
    );
  }

  return (
    <PageBody
      firstBlock={getFirstBlockName(topBlocks)}
      lastBlock={getLastBlockName(bottomBlocks || topBlocks)}
    >
      <SEO title={page?.title} metadata={page?.metadata} />

      <BlockSwitch
        blocks={topBlocks}
        blockProps={{
          SubNavigation: {
            alwaysShowBorder: true
          }
        }}
      />

      <div className="grid grid-layout-primary -mt-1">
        <Map
          features={mapCities.map(
            ({ name, id, uri, coordinates: { geometry } }) => ({
              type: 'Feature',
              properties: {
                name,
                id,
                type: 'city',
                uri
              },
              geometry: {
                ...geometry,
                coordinates: geometry.coordinates
              }
            })
          )}
        />

        <div className="col-span-full md:col-start-7 md:col-span-8 pb-10 md:pb-36">
          <Form
            primaryGrid={false}
            className="grid-cols-6 md:px-2"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <Row primaryGrid={false} className="md:col-span-5 flex-nowrap">
              <TextInput
                name="filter"
                placeholder={t('searchCity')}
                value={filter}
                onChange={(event) => {
                  setFilter(event.target.value);
                }}
                autoComplete="off"
              />

              {filter && (
                <button
                  type="button"
                  onClick={() => setFilter('')}
                  className="justify-start w-max mt-4 font-rubik text-2xs text-gray-600"
                >
                  {t('resetFilter')}
                </button>
              )}
            </Row>
          </Form>

          <MapList countries={cities} singularKicker={t('singleTitle')}
            pluralKicker={t('pluralTitle')}></MapList>
        </div>
      </div>

      {bottomBlocks && <BlockSwitch blocks={bottomBlocks} />}
    </PageBody>
  );
}

export async function getStaticProps({ locale }) {
  const getElapsed = hirestime();
  const client = createClient();
  const { initialState, ...globalData } = await queryGlobalData(
    locale,
    ['group'],
    { client }
  );
  const pageSlug = getSlugFromI18nNext(
    'take-part/all-groups',
    locale,
    globalData
  );
  const { format } = globalData._nextI18Next.initialI18nStore[locale];
  const [groups, page] = await Promise.all([
    await fetchAllGroups(locale, { client }),
    await getPage(...pageSlug.split('/').reverse(), locale, format, { client })
  ]);

  logger.info({
    message: 'timing all-groups',
    locale,
    path: `${locale}/take-part/all-groups`,
    time: getElapsed.seconds()
  });

  return {
    revalidate: 60 * 2,
    props: {
      page,
      cities: groups,
      ...globalData,
      initialState
    }
  };
}
