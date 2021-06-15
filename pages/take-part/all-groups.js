import { useRef, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import clsx from 'clsx';
import dynamic from 'next/dynamic';

import { BLOCK_PREFIX } from '@/lib/constants';
import { getPage } from '@/lib/pages';
import { fetchAllGroups } from '@/lib/take-part';
import { query as queryGlobalData } from '@/lib/global';
import { getFirstBlockName, getLastBlockName } from '@/lib/blocks';
import { getSlugFromI18nNext } from '@/lib/slug';
import useCityFilter from '@/lib/hooks/useCityFilter';

import Group from '@/components/Teaser/Group';
import BlockSwitch from '@/components/BlockSwitch';
import Form from '@/components/Form';
import PageBody from '@/components/PageBody';
import Row from '@/components/Form/Row';
import SEO from '@/components/SEO';
import TextInput from '@/components/Form/TextInput';

const Country = dynamic(() => import('@/components/Map/Country'));
const FederalCountry = dynamic(() => import('@/components/Map/FederalCountry'));
const Map = dynamic(() => import('@/components/Map'));

const ALLOWED_BLOCKS_TOP = [
  'Heading',
  'Richtext',
  'StageMedium',
  'SubNavigation'
];

function sortCities(cities) {
  return cities.sort(({ name: cityAName }, { name: cityBName }) =>
    cityAName.localeCompare(cityBName)
  );
}

function Cities({ cities }) {
  return (
    <ul className="grid md:grid-cols-2 gap-8 px-6">
      {cities.map((city) => (
        <li key={`city-${city.name}`}>
          <Group uri={city.uri} name={city.name} />
        </li>
      ))}
    </ul>
  );
}

function FederalCountries({ countries }) {
  const { t } = useTranslation('group');
  const numberOfCities = countries.reduce((acc, { cities }) => {
    acc = acc + cities.length;

    return acc;
  }, 0);

  if (numberOfCities === countries.length) {
    const allCities = countries.map(({ cities }) => cities).flat();

    return <Cities cities={sortCities(allCities)} />;
  }

  return (
    <ul className="flex flex-col space-y-10">
      {countries.map(({ name, uri, cities }) => (
        <li key={`federalCountry-${name}`}>
          <FederalCountry
            count={cities.length}
            singularKicker={t('singleTitle')}
            pluralKicker={t('pluralTitle')}
            name={name}
            uri={uri}
          />

          <Cities cities={sortCities(cities)} />
        </li>
      ))}
    </ul>
  );
}

export default function TakePartOverview({ cities: defaultCities, page }) {
  const { t } = useTranslation('group');
  const { cities, filter, setFilter } = useCityFilter(defaultCities);
  const mapCities = useMemo(
    () =>
      Object.keys(cities)
        .map((countryName) => {
          const federalCountryNames = Object.keys(
            cities[countryName].countries
          );

          return federalCountryNames
            .map(
              (federalCountryName) =>
                cities[countryName].countries[federalCountryName].cities
            )
            .flat();
        })
        .flat(),
    [cities]
  );
  const citiesListRef = useRef(null);
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

              citiesListRef?.current?.scrollIntoView({
                behavior: 'smooth'
              });
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

          <ul ref={citiesListRef}>
            {Object.keys(cities)
              .sort()
              .map((countryName, countryIndex) => (
                <li
                  key={`country-${countryName}`}
                  className={clsx(countryIndex > 0 && 'mt-12 md:mt-20')}
                >
                  <Country name={countryName} uri={cities[countryName].uri} />

                  <FederalCountries
                    countries={Object.keys(cities[countryName].countries)
                      .sort()
                      .map(
                        (federalCountryName) =>
                          cities[countryName].countries[federalCountryName]
                      )}
                  />
                </li>
              ))}
          </ul>
        </div>
      </div>

      {bottomBlocks && <BlockSwitch blocks={bottomBlocks} />}
    </PageBody>
  );
}

export async function getStaticProps({ locale }) {
  const { initialState, ...globalData } = await queryGlobalData(locale, [
    'group'
  ]);
  const pageSlug = getSlugFromI18nNext(
    'take-part/all-groups',
    locale,
    globalData
  );
  const groups = await fetchAllGroups();
  const page = await getPage(...pageSlug.split('/').reverse());

  return {
    // TODO: find a good magic number here
    revalidate: 20,
    props: {
      page,
      cities: groups,
      ...globalData,
      initialState
    }
  };
}
