import { getPage } from '@/lib/pages';
import { fetchAllGroups } from '@/lib/take-part';
import { query as queryGlobalData } from '@/lib/global';
import { useI18n } from 'next-localization';

import { Group, FederalCountry, Country, Map } from '@/components/Map';
import BlockSwitch from '@/components/BlockSwitch';
import Form, { Row, TextInput } from '@/components/Form';

export default function SafeHarboursOverview({ cities, page }) {
  const i18n = useI18n();

  return (
    <article>
      <BlockSwitch blocks={page?.content} />

      <div className="grid grid-layout-primary">
        <Map />

        <div className="col-span-full md:col-start-7 md:col-span-7 md:pl-10 pb-10 md:pb-36">
          <Form primaryGrid={false} className="grid-cols-6">
            <Row primaryGrid={false} className="md:col-span-5">
              <TextInput
                name="filter"
                placeholder={i18n.t('group.searchCity')}
              />
            </Row>
          </Form>

          <ul>
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
                          count={`${cities[countryName].countries[federalCountryName].cities.length}`}
                          singularKicker={i18n.t('group.singleTitle')}
                          pluralKicker={i18n.t('group.pluralTitle')}
                          name={federalCountryName}
                        />

                        <ul className="grid md:grid-cols-2 gap-8 px-6">
                          {cities[countryName].countries[
                            federalCountryName
                          ].cities.map((city) => (
                            <li key={`city-${city.name}`}>
                              <Group uri={city.uri} name={city.name} />
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
