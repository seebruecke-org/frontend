import { RETURN_CODES } from '@/lib/constants';
import { query, paths } from '@/lib/take-part';
import { query as queryGlobalData } from '@/lib/global';

import { StageMedium } from '@/components/Stages';
import { Group, FederalCountry, Country, Map } from '@/components/Map';
import BlockSwitch from '@/components/BlockSwitch';
import SectionNavigation from '@/components/SectionNavigation';

export default function TakePartPage({ pageType, ...props }) {
  if (pageType === 'cities-overview') {
    const { cities, page } = props;

    return (
      <article>
        <BlockSwitch blocks={page?.content} />

        <div className="grid grid-layout-primary">
          <Map />

          <ul className="col-span-full md:col-start-7 md:col-span-7 md:pl-10">
            {Object.keys(cities).map((countryName) => (
              <li key={`country-${countryName}`}>
                <Country name={countryName} />

                <ul className="flex flex-col space-y-10">
                  {Object.keys(cities[countryName].countries).map(
                    (federalCountryName) => (
                      <li key={`federalCountry-${federalCountryName}`}>
                        <FederalCountry
                          count={`${cities[countryName].countries[federalCountryName].cities.length} Lokalgruppen`}
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
      {
        locale: 'de',
        params: {
          slug: []
        }
      },

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
