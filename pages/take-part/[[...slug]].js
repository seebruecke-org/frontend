import NextLink from 'next/link';

import { RETURN_CODES } from '@/lib/constants';
import { query, paths } from '@/lib/take-part';
import { query as queryGlobalData } from '@/lib/global';

import { StageMedium } from '@/components/Stages';
import BlockSwitch from '@/components/BlockSwitch';
import SectionNavigation from '@/components/SectionNavigation';

export default function TakePartPage({ pageType, ...props }) {
  if (pageType === 'cities-overview') {
    const { cities } = props;

    return (
      <article className="grid grid-layout-primary">
        <div className="bg-gray-400 col-start-1 col-span-7 h-screen">Karte</div>

        <ul className="col-start-9 col-span-5">
          {Object.keys(cities).map((countryName) => (
            <li key={`country-${countryName}`}>
              <h2 className="font-brezel text-2xl font-bold italic leading-none bg-gray-200 px-5 py-10">
                {countryName}
              </h2>

              <ul>
                {Object.keys(cities[countryName].countries).map(
                  (federalCountryName) => (
                    <li key={`federalCountry-${federalCountryName}`}>
                      <h3 className="font-brezel text-xl font-bold italic p-5">
                        {federalCountryName}

                        <small className="block not-italic font-normal text-small">
                          {
                            cities[countryName].countries[federalCountryName]
                              .cities.length
                          }{' '}
                          Lokalgruppen
                        </small>
                      </h3>

                      <ul>
                        {cities[countryName].countries[
                          federalCountryName
                        ].cities.map((city) => (
                          <li key={`city-${city.name}`}>
                            <h4 className="font-brezel text-base font-bold italic">
                              <NextLink href={city.uri}>
                                <a className="bg-orange-200 hover:bg-orange-800 cursor-pointer p-5 block">
                                  {city.name}
                                </a>
                              </NextLink>
                            </h4>
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
