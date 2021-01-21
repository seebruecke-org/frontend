import { fetchAPI } from './api';
import { getFragments } from '@/components/Blocks';
import { FRAGMENT as FRAGMENT_IMAGE } from '@/components/Image';

async function getCityURI(citySlug, options = {}) {
  const optionsWithDefaults = {
    prefix: 'mach-mit',
    child: null,
    ...options
  };

  function generateURI(city) {
    const {
      slug,
      is_city_state: isCityState,
      federal_country: federalCountry,
      group,
      safe_harbour: safeHarbour
    } = city;
    const { prefix, child } = optionsWithDefaults;
    const federalCountrySlug = federalCountry?.slug;
    const countrySlug = federalCountry?.country?.slug;
    let uri = '';

    if (isCityState) {
      uri = `/${prefix}/${countrySlug}/${slug}`;
    } else {
      uri = `/${prefix}/${countrySlug}/${federalCountrySlug}/${slug}`;
    }

    if ((!group && safeHarbour) || child === 'safe-harbour') {
      uri = `${uri}/sicherer-hafen`;
    }

    return uri;
  }

  const { cities } = await fetchAPI(`
    query {
      cities(where: { slug: "${citySlug}"}) {
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

  const city = cities[0];
  const uri = generateURI(city);

  return uri;
}

async function createCityNavigation(city) {
  if (!city) {
    return null;
  }

  const navigation = [];
  const { slug } = city;

  if (city?.group) {
    const uri = await getCityURI(slug);

    navigation.push({
      path: uri,
      label: 'Lokalgruppe'
    });
  }

  if (city?.safe_harbour) {
    const uri = await getCityURI(slug, {
      child: 'safe-harbour'
    });

    navigation.push({
      path: uri,
      label: 'Sicherer Hafen'
    });
  }

  return navigation;
}

async function fetchPaths() {
  const cities = await fetchAllCities();

  return cities.map(async ({ slug, is_city_state, federal_country }) => {
    const citySlug = await getCityURI(slug, is_city_state, federal_country, {
      prefix: ''
    });

    return {
      slug: citySlug.split('/').filter((part) => !!part)
    };
  });
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

async function fetchData(slug = []) {
  switch (slug.length) {
    // /
    case 0: {
      const cities = await fetchAllCities();

      const filteredCities = cities.filter(({ group }) => !!group);

      const enrichedCities = await filteredCities.reduce(async (accP, city) => {
        const acc = await accP;
        const { slug, federal_country, ...cityProps } = city;
        const uri = await getCityURI(slug);
        const fullCityProps = {
          ...cityProps,
          uri
        };

        const federalCountryName = federal_country?.name;
        const countryName = federal_country?.country?.name;

        if (countryName && !acc[countryName]) {
          acc[countryName] = {
            countries: {}
          };
        }

        if (
          countryName &&
          federalCountryName &&
          !acc[countryName][federalCountryName]
        ) {
          acc[countryName].countries[federalCountryName] = {
            cities: []
          };
        }

        acc[countryName].countries[federalCountryName].cities.push(
          fullCityProps
        );

        return acc;
      }, Promise.resolve({}));

      return {
        data: {
          pageType: 'cities-overview',
          cities: enrichedCities
        }
      };
    }

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
      const navigation = await createCityNavigation(city);

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
      let navigation = await createCityNavigation(city);

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
      navigation = await createCityNavigation(safeHarbour);

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
      const navigation = await createCityNavigation(city);

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

export async function paths() {
  const data = await fetchPaths();

  return data;
}

export async function query(slug, locale) {
  const data = await fetchData(slug, locale);

  return data;
}
