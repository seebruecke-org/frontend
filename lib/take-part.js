import { fetchAPI } from './api';
import {
  createUri as createCityUri,
  createNavigation as createCityNavigation,
  createBreadcrumbs as createCityBreadcrumbs,
  createFederalCountryBreadcrumbs
} from './city';

import { getFragments } from '@/components/Blocks';
import { FRAGMENT as FRAGMENT_IMAGE } from '@/components/Image';
import { FRAGMENT as FRAGMENT_SAFE_HARBOURS } from '@/components/Demands/SafeHarbour';

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

export async function fetchAllCountryPaths() {
  const { countries } = await fetchAPI(`
    query {
      countries {
        slug
      }
    }
  `);

  return countries.map(({ slug }) => ({
    locale: 'de',
    params: {
      slug: [slug]
    }
  }));
}

export async function fetchAllFederalCountryPaths() {
  const { countries } = await fetchAPI(`
    query {
      countries {
        slug

        federal_countries {
          slug
        }
      }
    }
  `);

  return countries.reduce((acc, country) => {
    const { slug: countrySlug, federal_countries } = country;

    federal_countries.forEach(({ slug }) => {
      acc.push({
        locale: 'de',
        params: {
          slug: [countrySlug, slug].filter(Boolean)
        }
      });
    });

    return acc;
  }, []);
}

async function fetchAllCities() {
  const { cities } = await fetchAPI(`
    query {
      cities {
        name
        slug
        is_city_state
        coordinates

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
              exclude: [
                'StageMedium',
                'StageLarge',
                'SubNavigation',
                'Actions',
                'MediaGallery',
                'Newsletter',
                'Fundraisingbox'
              ]
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

async function fetchCountry(countrySlug) {
  const { countries } = await fetchAPI(`
    query {
      countries(where: { slug: "${countrySlug}"}) {
        name

        content {
          __typename

          ${getFragments({
            exclude: ['SubNavigation', 'Fundraisingbox']
          })}
        }
      }
    }
  `);

  const country = countries[0];

  if (!country) {
    return null;
  }

  return country;
}

async function fetchFederalCountry(countrySlug) {
  const { federalCountries } = await fetchAPI(`
    query {
      federalCountries(where: { slug: "${countrySlug}"}) {
        name

        content {
          __typename

          ${getFragments({
            exclude: ['SubNavigation', 'Fundraisingbox']
          })}
        }
      }
    }
  `);

  const federalCountry = federalCountries[0];

  if (!federalCountry) {
    return null;
  }

  return federalCountry;
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

          demands {
            ${FRAGMENT_SAFE_HARBOURS}
          }

          content {
            __typename

            ${getFragments({
              exclude: [
                'StageMedium',
                'StageLarge',
                'SubNavigation',
                'Actions',
                'MediaGallery',
                'Newsletter',
                'Fundraisingbox'
              ]
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
      const country = await fetchCountry(slug[slug.length - 1]);

      if (country) {
        return {
          data: {
            pageType: 'country',
            ...country
          }
        };
      }

      return {
        data: null
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
            breadcrumbs,
            ...city
          }
        };
      }

      const federalCountry = await fetchFederalCountry(lastSlug);
      const breadcrumbs = await createFederalCountryBreadcrumbs(lastSlug);

      if (federalCountry) {
        return {
          data: {
            pageType: 'federalcountry',
            breadcrumbs,
            ...federalCountry
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
      let breadcrumbs = await createCityBreadcrumbs(lastSlug);
      let navigation = await createCityNavigation(lastSlug);

      if (city) {
        return {
          data: {
            pageType: 'group',
            breadcrumbs,
            navigation,
            ...city
          }
        };
      }

      const safeHarbour = await fetchSafeHarbour(slug[slug.length - 2]);
      breadcrumbs = await createCityBreadcrumbs(slug[slug.length - 2]);
      navigation = await createCityNavigation(lastSlug);

      return {
        data: {
          pageType: 'safe-harbour',
          navigation,
          breadcrumbs,
          ...safeHarbour
        }
      };
    }

    // /[country]/[federal-country]/[city]/[slug]/
    case 4: {
      const citySlug = slug[slug.length - 2];
      const breadcrumbs = await createCityBreadcrumbs(citySlug);
      const city = await fetchSafeHarbour(citySlug);
      const navigation = await createCityNavigation(citySlug);

      return {
        data: {
          pageType: 'safe-harbour',
          navigation,
          breadcrumbs,
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
