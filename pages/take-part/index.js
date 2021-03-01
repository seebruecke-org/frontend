import { useState, useEffect, memo } from 'react';

import { getPage } from '@/lib/pages';
import { fetchAllGroups } from '@/lib/take-part';
import { query as queryGlobalData } from '@/lib/global';
import { useI18n } from 'next-localization';

import { FederalCountry, Country, Map } from '@/components/Map';
import Group from '@/components/Teaser/Group';
import BlockSwitch from '@/components/BlockSwitch';
import Form, { Row, TextInput } from '@/components/Form';

function filterCities(cities, term) {
  return Object.keys(cities).reduce((acc, countryName) => {
    const federalCountries = cities[countryName].countries;
    const matchingFederalCountries = {};

    Object.keys(federalCountries).forEach((federalCountryName) => {
      const federalCountry = federalCountries[federalCountryName];

      federalCountry.cities.forEach((city) => {
        const { name: cityName } = city;

        if (cityName.includes(term)) {
          if (!matchingFederalCountries[federalCountryName]) {
            matchingFederalCountries[federalCountryName] = { cities: [] };
          }

          matchingFederalCountries[federalCountryName].cities.push(city);
        }
      });
    });

    if (Object.keys(matchingFederalCountries).length > 0) {
      acc[countryName] = {
        countries: matchingFederalCountries
      };
    }

    return acc;
  }, {});
}

const MemoizedMap = memo(Map);

export default function TakePartOverview({ cities: defaultCities, page }) {
  const i18n = useI18n();
  const [filterValue, setFilterValue] = useState(null);
  const [cities, setCities] = useState(defaultCities);

  useEffect(() => {
    if (filterValue) {
      setCities(filterCities(defaultCities, filterValue));
    } else {
      setCities(defaultCities);
    }
  }, [filterValue]);

  return (
    <article>
      <BlockSwitch blocks={page?.content} />

      <div className="grid grid-layout-primary">
        <MemoizedMap />

        <div className="col-span-full md:col-start-7 md:col-span-8 pb-10 md:pb-36">
          <Form primaryGrid={false} className="grid-cols-6">
            <Row primaryGrid={false} className="md:col-span-5 flex-nowrap">
              <TextInput
                name="filter"
                placeholder={i18n.t('group.searchCity')}
                value={filterValue}
                onChange={(event) => {
                  setFilterValue(event.target.value);
                }}
                autocomplete="off"
              />

              {filterValue && (
                <button
                  type="button"
                  onClick={() => setFilterValue('')}
                  className="justify-start w-max mt-4 font-rubik text-2xs text-gray-600"
                >
                  Filter zurücksetzen
                </button>
              )}
            </Row>
          </Form>

          <ul>
            {Object.keys(cities)
              .sort()
              .map((countryName, countryIndex) => (
                <li
                  key={`country-${countryName}`}
                  className={`${countryIndex > 0 && 'mt-20'}`}
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
                            singularKicker={i18n.t('group.singleTitle')}
                            pluralKicker={i18n.t('group.pluralTitle')}
                            name={federalCountryName}
                          />

                          <ul className="grid md:grid-cols-2 gap-8 px-6">
                            {cities[countryName].countries[
                              federalCountryName
                            ].cities
                              .sort(
                                ({ name: cityAName }, { name: cityBName }) =>
                                  cityAName.localeCompare(cityBName)
                              )
                              .map((city) => (
                                <li key={`city-${city.name}`}>
                                  <Group uri={city.uri} name={city.name} />
                                </li>
                              ))}
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
  const groups = await fetchAllGroups();
  const page = await getPage('mach-mit');
  const { initialState, ...globalData } = await queryGlobalData(locale);

  return {
    // TODO: find a good magic number here
    revalidate: 60,
    props: {
      page,
      cities: groups,
      ...globalData,
      initialState
    }
  };
}
