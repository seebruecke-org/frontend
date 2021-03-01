import { fetchAPI } from './api';
import {
  createUri as createCityUri,
  createNavigation as createCityNavigation
} from './city';

import { getFragments } from '@/components/Blocks';
import { FRAGMENT as FRAGMENT_IMAGE } from '@/components/Image';

export async function fetchAllGroupPaths() {
  const { cities } = await fetchAPI(`
    query {
      cities {
        slug

        safe_harbour {
          id
        }
      }
    }
  `);

  const paths = await Promise.all(
    cities.map(async ({ slug, safe_harbour }) => {
      const citySlug = await createCityUri(slug, {
        prefix: ''
      });

      const paths = [
        {
          locale: 'de',
          params: {
            slug: citySlug.split('/').filter(Boolean)
          }
        }
      ];

      if (safe_harbour) {
        const safeHarbourSlug = await createCityUri(slug, {
          prefix: '',
          child: 'safe-harbour'
        });

        paths.push({
          locale: 'de',
          params: {
            slug: safeHarbourSlug.split('/').filter(Boolean)
          }
        });
      }

      return paths;
    })
  );

  return paths.flat();
}

async function fetchAllCities() {
  const { cities } = await fetchAPI(`
    query {
      cities {
        name
        slug
        is_city_state

        group {
          id
        }

        federal_country {
          name
          slug

          country {
            name
            slug
          }
        }
      }
    }
  `);

  return cities;
}

async function fetchGroup(citySlug) {
  const { cities } = await fetchAPI(`
    query {
      cities(where: { slug: "${citySlug}"}) {
        name
        slug

        group {
          featured_image {
            image {
              ${FRAGMENT_IMAGE}
            }
          }

          content {
            __typename

            ${getFragments({
              exclude: ['StageMedium', 'StageLarge', 'SubNavigation']
            })}
          }
        }

        safe_harbour {
          id
        }
      }
    }
  `);

  const city = cities[0];

  if (!city?.group) {
    return null;
  }

  return city;
}

async function fetchSafeHarbour(citySlug) {
  const { cities } = await fetchAPI(`
    query {
      cities(where: { slug: "${citySlug}"}) {
        name
        slug

        group {
          id
        }

        safe_harbour {
          featured_image {
            image {
              ${FRAGMENT_IMAGE}
            }
          }

          content {
            __typename

            ${getFragments({
              exclude: ['StageMedium', 'StageLarge', 'SubNavigation']
            })}
          }
        }
      }
    }
  `);

  return cities[0];
}

export async function fetchAllGroups() {
  const cities = await fetchAllCities();
  const citiesWithGroup = cities.filter(({ group }) => !!group);

  const enrichedCities = await citiesWithGroup.reduce(
    async (accPromise, city) => {
      const acc = await accPromise;
      const { slug, federal_country, ...cityProps } = city;
      const uri = await createCityUri(slug);
      const fullCityProps = {
        ...cityProps,
        uri
      };

      const countryName = federal_country?.country?.name;
      const countryExists = countryName && !acc[countryName];

      // Create the country if it doesn't exist yet
      if (countryExists) {
        acc[countryName] = {
          countries: {}
        };
      }

      const federalCountryName = federal_country?.name;
      const federalCountryExists =
        countryName &&
        federalCountryName &&
        !acc[countryName].countries[federalCountryName];

      // Create the federal country if it doesn't exist yet
      if (federalCountryExists) {
        acc[countryName].countries[federalCountryName] = {
          cities: []
        };
      }

      acc[countryName].countries[federalCountryName].cities.push(fullCityProps);

      return acc;
    },
    Promise.resolve({})
  );

  return enrichedCities;
}

async function fetchData(slug = []) {
  switch (slug.length) {
    // /[country]/
    case 1: {
      return {
        data: {}
      };
    }

    // /[country]/[federal-country]/
    // /[country]/[city]/
    case 2: {
      const lastSlug = slug[slug.length - 1];
      const city = await fetchGroup(lastSlug);
      const navigation = await createCityNavigation(lastSlug);

      if (city) {
        return {
          data: {
            pageType: 'group',
            navigation,
            ...city
          }
        };
      }

      return {
        data: null
      };
    }

    // /[country]/[federal-country]/[city]/
    // /[country]/[city]/[slug]/
    case 3: {
      const lastSlug = slug[slug.length - 1];
      const city = await fetchGroup(lastSlug);
      let navigation = await createCityNavigation(lastSlug);

      if (city) {
        return {
          data: {
            pageType: 'group',
            navigation,
            ...city
          }
        };
      }

      const safeHarbour = await fetchSafeHarbour(slug[slug.length - 2]);
      navigation = await createCityNavigation(lastSlug);

      return {
        data: {
          pageType: 'safe-harbour',
          navigation,
          ...safeHarbour
        }
      };
    }

    // /[country]/[federal-country]/[city]/[slug]/
    case 4: {
      const city = await fetchSafeHarbour(slug[slug.length - 2]);
      const navigation = await createCityNavigation(slug[slug.length - 2]);

      return {
        data: {
          pageType: 'safe-harbour',
          navigation,
          ...city
        }
      };
    }

    default:
      return {
        data: null
      };
  }
}

export async function query(slug, locale) {
  const data = await fetchData(slug, locale);

  return data;
}
