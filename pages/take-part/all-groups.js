import { memo, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import clsx from 'clsx';

import { getPage } from '@/lib/pages';
import { fetchAllGroups } from '@/lib/take-part';
import { query as queryGlobalData } from '@/lib/global';
import useCityFilter from '@/lib/hooks/useCityFilter';

import { FederalCountry, Country, Map } from '@/components/Map';
import Group from '@/components/Teaser/Group';
import BlockSwitch from '@/components/BlockSwitch';
import Form, { Row, TextInput } from '@/components/Form';
import SEO from '@/components/SEO';

const MemoizedMap = memo(Map);

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
  const { t } = useTranslation();
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
            singularKicker={t('group.singleTitle')}
            pluralKicker={t('group.pluralTitle')}
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
  const { t } = useTranslation();
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
            <Row primaryGrid={false} className="md:col-span-5 flex-nowrap">
              <TextInput
                name="filter"
                placeholder={t('group.searchCity')}
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
                  Filter zurücksetzen
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
    </article>
  );
}

export async function getStaticProps({ locale }) {
  const groups = await fetchAllGroups();
  const page = await getPage('lokalgruppen');
  const { initialState, ...globalData } = await queryGlobalData(locale);

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
