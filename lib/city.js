import { fetchAPI } from './api';
import { getLocalizedSlug } from '@/lib/slug';

export async function createBreadcrumbs(slug, locale, options) {
  if (!slug) {
    return null;
  }

  const breadcrumbs = [];

  const { cities } = await fetchAPI(
    `
    query {
      cities(filters: { slug: {eq:"${slug}"}}, locale: "${locale}") {data{attributes{
        is_city_state

        federal_country {data{attributes{
          slug
          name
          content {
            __typename
          }

          country {data{attributes{
            slug
            name
            content {
              __typename
            }
          }}}
        }}}
      }}}
    }
  `,
    options
  );

  const city = cities[0] || {};

  if (city?.federal_country?.country) {
    const uri = await createCountryUri(
      city.federal_country.country.slug,
      locale,
      options
    );
    const hasContent =
      city?.federal_country?.country?.content &&
      city?.federal_country?.country?.content?.length > 0;

    breadcrumbs.push({
      url: hasContent && uri,
      label: city.federal_country.country.name
    });
  }

  if (city?.federal_country && !city?.is_city_state) {
    const uri = await createFederalCountryUri(
      city.federal_country.slug,
      locale,
      options
    );
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

export async function createFederalCountryBreadcrumbs(slug, locale, options) {
  if (!slug) {
    return null;
  }

  const breadcrumbs = [];

  const { federalCountries } = await fetchAPI(
    `
    query {
      federalCountries(filters: { slug: {eq:"${slug}"}}, locale: "${locale}") {data{attributes{
        country {data{attributes{
          slug
          name
        }}}
      }}}
    }
  `,
    options
  );

  const federalCountry = federalCountries[0] || {};

  if (federalCountry) {
    const uri = await createCountryUri(
      federalCountry.country.slug,
      locale,
      options
    );

    breadcrumbs.push({
      url: uri,
      label: federalCountry.country.name
    });
  }

  return breadcrumbs;
}

export async function createUri(cityOrCitySlug, options = {}, apiOptions) {
  const prefix = await getLocalizedSlug('take-part', options.locale);
  const safeHarbourPostfix = await getLocalizedSlug(
    'safe-harbour',
    options.locale
  );
  const optionsWithDefaults = {
    prefix,
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
      uri = `${uri}/${safeHarbourPostfix}`;
    }

    return uri;
  }

  async function fetchCity(citySlug, options) {
    const { cities } = await fetchAPI(
      `
      query {
        cities(filters: { slug: {eq:"${citySlug}"}}, locale: "${options.locale}") {data{attributes{
          slug
          is_city_state

          group {data{
            id
          }}

          safe_harbour {data{
            id
          }}

          federal_country {data{attributes{
            slug

            country {data{attributes{
              slug
            }}}
          }}}
        }
      }}}
    `,
      options
    );

    return cities[0];
  }

  let city = cityOrCitySlug;
  if (typeof cityOrCitySlug === 'string') {
    city = await fetchCity(cityOrCitySlug, {...apiOptions, locale: options.locale});
  }

  return generateURI(city);
}

export async function createCountryUri(slug, locale, options) {
  const prefix = await getLocalizedSlug('take-part', locale);
  const { countries } = await fetchAPI(
    `
    query {
      countries(filters: { slug: {eq:"${slug}"}}, locale: "${locale}") {data{attributes{
        slug
      }}}
    }
  `,
    options
  );

  const country = countries[0];

  return `/${prefix}/${country.slug}`;
}

export async function createFederalCountryUri(slug, locale, options) {
  const prefix = await getLocalizedSlug('take-part', locale);
  const { federalCountries } = await fetchAPI(
    `
    query {
      federalCountries(filters: { slug: {eq:"${slug}"}}, locale: "${locale}") {data{attributes{
        slug

        country {data{attributes{
          slug
        }}}
      }}}
    }
  `,
    options
  );

  const federalCountry = federalCountries[0];

  return `/${prefix}/${federalCountry.country.slug}/${federalCountry.slug}`;
}

export async function createNavigation(slug, locale, options) {
  if (!slug) {
    return null;
  }

  const navigation = [];

  const { cities } = await fetchAPI(
    `
    query {
      cities(filters: { slug: {eq:"${slug}"}}, locale: "${locale}") {data{attributes{
        is_city_state

        group {data{
          id
        }}

        safe_harbour {data{
          id
        }}

        federal_country {data{attributes{
          slug

          country {data{attributes{
            slug
          }}}
        }}}
      }
    }}}
  `,
    options
  );

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
    const uri = await createUri(
      uriObject,
      {
        locale
      },
      options
    );

    navigation.push({
      url: uri,
      label: locale === 'de' ? 'Lokalgruppe' : 'Local Group'
    });
  }

  if (safe_harbour) {
    const uri = await createUri(uriObject, {
      child: 'safe-harbour',
      locale
    });

    navigation.push({
      url: uri,
      label: locale === 'de' ? 'Sicherer Hafen' : 'Safe Harbours'
    });
  }

  return navigation;
}
