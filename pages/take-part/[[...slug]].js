import { RETURN_CODES } from '@/lib/constants';
import { query, paths } from '@/lib/take-part';
import { query as queryGlobalData } from '@/lib/global';
import { useI18n } from 'next-localization';

import { StageMedium } from '@/components/Stages';
import { Group, FederalCountry, Country, Map } from '@/components/Map';
import BlockSwitch from '@/components/BlockSwitch';
import SectionNavigation from '@/components/SectionNavigation';
import Form, { Row, TextInput } from '@/components/Form';

export default function TakePartPage({ pageType, ...props }) {
  const i18n = useI18n();

  if (pageType === 'cities-overview') {
    const { cities, page } = props;

    return (
      <article>
        <BlockSwitch blocks={page?.content} />

        <div className="grid grid-layout-primary">
          <Map />

          <div className="col-span-full md:col-start-7 md:col-span-7 md:pl-10 pb-10 md:pb-36">
            <Form primaryGrid={false} className="grid-cols-6">
              <Row primaryGrid={false} className="md:col-span-5">
                <TextInput name="filter" placeholder="Stadt suchen ..." />
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
                            singularKicker={i18n.t('localgroup.singleTitle')}
                            pluralKicker={i18n.t('localgroup.pluralTitle')}
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

  if (pageType === 'group' || pageType === 'safe-harbour') {
    const { name, group, safe_harbour, navigation } = props;
    const featuredImage =
      pageType === 'group'
        ? group?.featured_image?.image
        : safe_harbour?.featured_image?.image;

    return (
      <article className="grid grid-layout-primary">
        <StageMedium
          title={name}
          kicker={pageType === 'group' ? 'Lokalgruppe' : 'Sicherer Hafen'}
          className="col-span-full"
          image={featuredImage}
        />

        {navigation && navigation.length > 1 && (
          <SectionNavigation items={navigation} className="col-span-full" />
        )}

        <BlockSwitch blocks={group?.content} className="col-span-full" />
      </article>
    );
  }

  return <article></article>;
}

export async function getStaticPaths() {
  const sitePaths = await paths();

  return {
    fallback: true,
    paths: [
      ...sitePaths.map(({ slug }) => ({
        locale: 'de',
        params: {
          slug
        }
      }))
    ]
  };
}

export async function getStaticProps({ locale, params }) {
  const { slug } = params;
  const { type, data, ...res } = await query(slug, locale);
  const { initialState, ...globalData } = await queryGlobalData(locale);

  if (type === RETURN_CODES.REDIRECT) {
    return {
      redirect: {
        destination: res.destination,
        permanent: true
      }
    };
  }

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
