import { getPage } from '@/lib/pages';
import { fetchAllSafeHarbours } from '@/lib/take-part';
import { query as queryGlobalData } from '@/lib/global';
import { useTranslation } from 'next-i18next';
import { memo, useRef } from 'react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';

import { getSlugFromI18nNext } from '@/lib/slug';
import SafeHarbour from '@/components/Teaser/SafeHarbour';
import BlockSwitch from '@/components/BlockSwitch';
import Form from '@/components/Form';
import Row from '@/components/Form/Row';
import SEO from '@/components/SEO';
import TextInput from '@/components/Form/TextInput';

import useCityFilter from '@/lib/hooks/useCityFilter';

const Country = dynamic(() => import('@/components/Map/Country'));
const FederalCountry = dynamic(() => import('@/components/Map/FederalCountry'));
const Map = dynamic(() => import('@/components/Map'));
const MemoizedMap = memo(Map);

export default function SafeHarboursOverview({ cities: defaultCities, page }) {
  const { t } = useTranslation('safe-harbour');
  const { cities, filter, setFilter } = useCityFilter(defaultCities);
  const mapCities = Object.keys(cities)
    .map((countryName) => {
      const federalCountryNames = Object.keys(cities[countryName].countries);

      return federalCountryNames
        .map(
          (federalCountryName) =>
            cities[countryName].countries[federalCountryName].cities
        )
        .flat();
    })
    .flat();
  const citiesListRef = useRef(null);

  return (
    <article>
      <SEO title={page?.title} metadata={page?.metadata} />

      <BlockSwitch blocks={page?.content} />

      <div className="grid grid-layout-primary">
        <MemoizedMap
          features={mapCities.map(
            ({ name, id, coordinates: { geometry } }) => ({
              type: 'Feature',
              properties: {
                name,
                id,
                type: 'city'
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
            className="grid-cols-6"
            onSubmit={(event) => {
              event.preventDefault();

              citiesListRef?.current?.scrollIntoView({
                behavior: 'smooth'
              });
            }}
          >
            <Row primaryGrid={false} className="md:col-span-5">
              <TextInput
                name="filter"
                placeholder={t('searchCity')}
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
                  <Country name={countryName} />

                  <ul className="flex flex-col space-y-10">
                    {Object.keys(cities[countryName].countries)
                      .sort()
                      .map((federalCountryName) => (
                        <li key={`federalCountry-${federalCountryName}`}>
                          <FederalCountry
                            count={
                              cities[countryName].countries[federalCountryName]
                                .cities.length
                            }
                            singularKicker={t('singleTitle')}
                            pluralKicker={t('pluralTitle')}
                            name={federalCountryName}
                            uri={
                              cities[countryName].countries[federalCountryName]
                                .uri
                            }
                          />

                          <ul className="grid md:grid-cols-2 gap-8 px-6">
                            {cities[countryName].countries[
                              federalCountryName
                            ].cities
                              .sort(
                                ({ name: cityAName }, { name: cityBName }) =>
                                  cityAName.localeCompare(cityBName)
                              )
                              .map(
                                ({
                                  name,
                                  safe_harbour: {
                                    demands_count,
                                    demands_fullfilled,
                                    since,
                                    uri
                                  }
                                }) => {
                                  let description = t('demand.fullfilledFrom', {
                                    fullfilled: demands_fullfilled,
                                    count: demands_count
                                  });

                                  if (demands_fullfilled === null) {
                                    description = t('demand.stateUnknown');
                                  }

                                  return (
                                    <li key={`city-${name}`}>
                                      <SafeHarbour
                                        uri={uri}
                                        name={name}
                                        description={description}
                                        since={since}
                                      />
                                    </li>
                                  );
                                }
                              )}
                          </ul>
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export async function getStaticProps({ locale }) {
  const { initialState, ...globalData } = await queryGlobalData(locale, [
    'safe-harbour'
  ]);
  const pageSlug = getSlugFromI18nNext(
    'safe-harbours/all-harbours',
    locale,
    globalData
  );
  const groups = await fetchAllSafeHarbours(locale);
  const page = await getPage(...pageSlug.split('/').reverse(), locale);

  return {
    // TODO: find a good magic number here
    revalidate: 60 * 60 * 6,
    props: {
      page,
      cities: groups,
      ...globalData,
      initialState
    }
  };
}
