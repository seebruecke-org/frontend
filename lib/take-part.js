import { point } from '@turf/helpers';

import { fetchAPI } from './api';
import {
  createUri as createCityUri,
  createNavigation as createCityNavigation,
  createBreadcrumbs as createCityBreadcrumbs,
  createFederalCountryBreadcrumbs,
  createCountryUri,
  createFederalCountryUri
} from './city';

import { getFragments, sideloadBlockData } from '@/components/Blocks';
import { FRAGMENT as FRAGMENT_MEDIA } from '@/components/Media';
import { FRAGMENT as FRAGMENT_SAFE_HARBOURS } from '@/components/Demands/SafeHarbour';

export async function fetchAllGroupPaths() {
  const { cities } = await fetchAPI(`
    query {
      cities {
        slug
        is_city_state

        group {
          id
        }

        safe_harbour {
          id
        }

        federal_country {
          slug

          country {
            slug
          }
        }
      }
    }
  `);

  const paths = await Promise.all(
    cities.map(
      async ({ slug, is_city_state, group, safe_harbour, federal_country }) => {
        if (!group && !safe_harbour) {
          return null;
        }

        const paths = [];
        const uriObject = {
          slug,
          is_city_state,
          safe_harbour,
          group,
          federal_country
        };

        if (group) {
          const citySlug = await createCityUri(uriObject, {
            prefix: '',
            safeHarbourFallback: false
          });

          paths.push({
            locale: 'de',
            params: {
              slug: citySlug.split('/').filter(Boolean)
            }
          });
        }

        if (safe_harbour) {
          const safeHarbourSlug = await createCityUri(uriObject, {
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
      }
    )
  );

  return paths.flat().filter(Boolean);
}

export async function fetchAllCountryPaths() {
  const { countries } = await fetchAPI(`
    query {
      countries {
        slug
        content {
          __typename
        }
      }
    }
  `);

  return countries
    .map(({ slug, content }) => {
      if (!content || content.length === 0) {
        return null;
      }

      return {
        locale: 'de',
        params: {
          slug: [slug]
        }
      };
    })
    .filter(Boolean);
}

export async function fetchAllFederalCountryPaths() {
  const { countries } = await fetchAPI(`
    query {
      countries {
        slug

        federal_countries {
          slug
          content {
            __typename
          }
        }
      }
    }
  `);

  return countries.reduce((acc, country) => {
    const { slug: countrySlug, federal_countries } = country;

    if (federal_countries) {
      federal_countries.forEach(({ slug, content }) => {
        if (content && content.length > 0) {
          acc.push({
            locale: 'de',
            params: {
              slug: [countrySlug, slug].filter(Boolean)
            }
          });
        }
      });
    }

    return acc;
  }, []);
}

async function fetchAllCities() {
  const { cities } = await fetchAPI(`
    query {
      cities {
        id
        name
        slug
        is_city_state
        coordinates

        group {
          id
        }

        safe_harbour {
          since
          demands {
            ${FRAGMENT_SAFE_HARBOURS}
          }
        }

        federal_country {
          name
          slug
          content {
            __typename
          }

          country {
            name
            slug
            content {
              __typename
            }
          }
        }
      }
    }
  `);

  return cities.map(({ coordinates, ...city }) => {
    const [lat, lng] = coordinates.split(',');

    return {
      ...city,
      coordinates: point([parseFloat(lng), parseFloat(lat)])
    };
  });
}

async function fetchGroup(citySlug) {
  const { cities } = await fetchAPI(`
    query {
      cities(where: { slug: "${citySlug}"}) {
        name
        slug

        group {
          image {
            ${FRAGMENT_MEDIA}
          }

          content {
            __typename

            ${getFragments({
              exclude: [
                'StageMedium',
                'StageLarge',
                'SubNavigation',
                'Actions',
                'Newsletter',
                'Fundraisingbox'
              ]
            })}
          }

          actions {
            title
            slug
            intro
            start
            slug
            location
            location_detail
          }
        }

        safe_harbour {
          id
          since
        }
      }
    }
  `);

  const city = cities[0];

  if (!city?.group) {
    return null;
  }

  city.group = await sideloadBlockData(city.group, 'content');

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

  return await sideloadBlockData(country, 'content');
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

  return await sideloadBlockData(federalCountry, 'content');
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
          since
          image {
            ${FRAGMENT_MEDIA}
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

  const city = cities[0];
  city.safe_harbour = await sideloadBlockData(city?.safe_harbour, 'content');

  return city;
}

async function createLocalCityStructure(cities) {
  const enrichedCities = await cities.reduce(async (accPromise, city) => {
    const acc = await accPromise;
    const { slug, federal_country, safe_harbour, ...cityProps } = city;
    const uri = await createCityUri(slug);

    if (safe_harbour) {
      safe_harbour.uri = await createCityUri(slug, {
        child: 'safe-harbour'
      });
    }

    const fullCityProps = {
      ...cityProps,
      safe_harbour,
      uri
    };

    const countryName = federal_country?.country?.name;
    const countryHasContent = federal_country?.country?.content?.length > 0;
    const countryExists = countryName && !acc[countryName];

    // Create the country if it doesn't exist yet
    if (countryExists) {
      acc[countryName] = {
        countries: {}
      };

      if (countryHasContent) {
        acc[countryName].uri = await createCountryUri(
          federal_country.country.slug
        );
      }
    }

    const federalCountryName = federal_country?.name;
    const federalCountryHasContent = federal_country?.content?.length > 0;
    const federalCountryExists =
      countryName &&
      federalCountryName &&
      !acc[countryName].countries[federalCountryName];

    // Create the federal country if it doesn't exist yet
    if (federalCountryExists) {
      acc[countryName].countries[federalCountryName] = {
        cities: []
      };

      if (federalCountryHasContent) {
        acc[countryName].countries[
          federalCountryName
        ].uri = await createFederalCountryUri(federal_country.slug);
      }
    }

    acc[countryName].countries[federalCountryName].cities.push(fullCityProps);

    return acc;
  }, Promise.resolve({}));

  return enrichedCities;
}

export async function fetchAllGroups() {
  const cities = await fetchAllCities();
  const citiesWithGroup = cities
    .filter(({ group }) => !!group)
    .map((city) => {
      // We don't need that info on the client
      city.safe_harbour = null;
      return city;
    });

  return await createLocalCityStructure(citiesWithGroup);
}

export async function fetchAllSafeHarbours() {
  const cities = await fetchAllCities();
  const citiesWithSafeHarbour = cities
    .filter(({ safe_harbour }) => !!safe_harbour)
    .map(({ safe_harbour, ...city }) => {
      const { demands } = safe_harbour;

      safe_harbour.demands_fullfilled =
        demands && Object.values(demands).filter((demand) => !!demand).length;
      safe_harbour.demands_count = 8; // TODO

      return {
        ...city,
        safe_harbour
      };
    });

  return await createLocalCityStructure(citiesWithSafeHarbour);
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
      let breadcrumbs = await createCityBreadcrumbs(lastSlug);

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
      breadcrumbs = await createFederalCountryBreadcrumbs(lastSlug);

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
