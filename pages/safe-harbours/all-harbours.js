import { getPage } from '@/lib/pages';
import { fetchAllGroups } from '@/lib/take-part';
import { query as queryGlobalData } from '@/lib/global';
import { useI18n } from 'next-localization';
import { memo, useRef } from 'react';

import { FederalCountry, Country, Map } from '@/components/Map';
import SafeHarbour from '@/components/Teaser/SafeHarbour';
import BlockSwitch from '@/components/BlockSwitch';
import Form, { Row, TextInput } from '@/components/Form';

import useCityFilter from '@/lib/hooks/useCityFilter';

const MemoizedMap = memo(Map);

export default function SafeHarboursOverview({ cities: defaultCities, page }) {
  const i18n = useI18n();
  const { cities, filter, setFilter } = useCityFilter(defaultCities);
  const citiesListRef = useRef(null);

  return (
    <article>
      <BlockSwitch blocks={page?.content} />

      <div className="grid grid-layout-primary">
        <MemoizedMap />

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
                placeholder={i18n.t('group.searchCity')}
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
            {Object.keys(cities).map((countryName, countryIndex) => (
              <li
                key={`country-${countryName}`}
                className={`${countryIndex > 0 && 'mt-20'}`}
              >
                <Country name={countryName} />

                <ul className="flex flex-col space-y-10">
                  {Object.keys(cities[countryName].countries).map(
                    (federalCountryName) => (
                      <li key={`federalCountry-${federalCountryName}`}>
                        <FederalCountry
                          count={
                            cities[countryName].countries[federalCountryName]
                              .cities.length
                          }
                          singularKicker={i18n.t('safeHarbour.singleTitle')}
                          pluralKicker={i18n.t('safeHarbour.pluralTitle')}
                          name={federalCountryName}
                        />

                        <ul className="grid md:grid-cols-2 gap-8 px-6">
                          {cities[countryName].countries[
                            federalCountryName
                          ].cities.map((city) => (
                            <li key={`city-${city.name}`}>
                              <SafeHarbour
                                uri={`${city.uri}/sicherer-hafen`}
                                name={city.name}
                                description="2 / 8 Forderungen"
                                since="19. Mai 2018"
                              />
                            </li>
                          ))}
                        </ul>
                      </li>
                    )
                  )}
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
  const page = await getPage('alle-haefen');
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
