import { fetchAPI } from './api';

export async function createBreadcrumbs(slug) {
  if (!slug) {
    return null;
  }

  const breadcrumbs = [];

  const { cities } = await fetchAPI(`
    query {
      cities(where: { slug: "${slug}"}) {
        is_city_state

        federal_country {
          slug
          name
          content {
            __typename
          }

          country {
            slug
            name
            content {
              __typename
            }
          }
        }
      }
    }
  `);

  const city = cities[0] || {};

  if (city?.federal_country?.country) {
    const uri = await createCountryUri(city.federal_country.country.slug);
    const hasContent =
      city?.federal_country?.country?.content &&
      city?.federal_country?.country?.content?.length > 0;

    breadcrumbs.push({
      url: hasContent && uri,
      label: city.federal_country.country.name
    });
  }

  if (city?.federal_country && !city?.is_city_state) {
    const uri = await createFederalCountryUri(city.federal_country.slug);
    const hasContent =
      city?.federal_country?.content &&
      city?.federal_country?.content?.length > 0;

    breadcrumbs.push({
      url: hasContent && uri,
      label: city.federal_country.name
    });
  }

  return breadcrumbs;
}

export async function createFederalCountryBreadcrumbs(slug) {
  if (!slug) {
    return null;
  }

  const breadcrumbs = [];

  const { federalCountries } = await fetchAPI(`
    query {
      federalCountries(where: { slug: "${slug}"}) {
        country {
          slug
          name
        }
      }
    }
  `);

  const federalCountry = federalCountries[0] || {};

  if (federalCountry) {
    const uri = await createCountryUri(federalCountry.country.slug);

    breadcrumbs.push({
      url: uri,
      label: federalCountry.country.name
    });
  }

  return breadcrumbs;
}

export async function createUri(cityOrCitySlug, options = {}) {
  const optionsWithDefaults = {
    prefix: 'mach-mit',
    child: null,
    safeHarbourFallback: true,
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
    const { prefix, child, safeHarbourFallback } = optionsWithDefaults;
    const federalCountrySlug = federalCountry?.slug;
    const countrySlug = federalCountry?.country?.slug;
    let uri = `/${prefix}/${countrySlug}`;

    if (isCityState) {
      uri = `${uri}/${slug}`;
    } else {
      uri = `${uri}/${federalCountrySlug}/${slug}`;
    }

    if (
      (!group && safeHarbour && safeHarbourFallback) ||
      child === 'safe-harbour'
    ) {
      uri = `${uri}/sicherer-hafen`;
    }

    return uri;
  }

  async function fetchCity(citySlug) {
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

    return cities[0];
  }

  const city =
    typeof cityOrCitySlug === 'string' ? await fetchCity(cityOrCitySlug) : city;

  return generateURI(city);
}

export async function createCountryUri(slug) {
  const { countries } = await fetchAPI(`
    query {
      countries(where: { slug: "${slug}"}) {
        slug
      }
    }
  `);

  const country = countries[0];

  return `/mach-mit/${country.slug}`;
}

export async function createFederalCountryUri(slug) {
  const { federalCountries } = await fetchAPI(`
    query {
      federalCountries(where: { slug: "${slug}"}) {
        slug

        country {
          slug
        }
      }
    }
  `);

  const federalCountry = federalCountries[0];

  return `/mach-mit/${federalCountry.country.slug}/${federalCountry.slug}`;
}

export async function createNavigation(slug) {
  if (!slug) {
    return null;
  }

  const navigation = [];

  const { cities } = await fetchAPI(`
    query {
      cities(where: { slug: "${slug}"}) {
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

  const city = cities[0] || {};
  const { is_city_state, group, safe_harbour, federal_country } = city;
  const uriObject = {
    slug,
    is_city_state,
    group,
    safe_harbour,
    federal_country
  };

  if (group) {
    const uri = await createUri(uriObject);

    navigation.push({
      url: uri,
      label: 'Lokalgruppe'
    });
  }

  if (safe_harbour) {
    const uri = await createUri(uriObject, {
      child: 'safe-harbour'
    });

    navigation.push({
      url: uri,
      label: 'Sicherer Hafen'
    });
  }

  return navigation;
}
