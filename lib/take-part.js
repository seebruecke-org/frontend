import format from "date-fns/format";
import slugify from "slugify";
import { unified } from "unified";
import markdown from "remark-parse";
import extractToc from "remark-extract-toc";

import { fetchAPI } from "./api";
import { blockNameMatches } from "./blocks";
import { toMapboxCoordinates } from "./coordinates";
import {
  createBreadcrumbs as createCityBreadcrumbs,
  createCountryUri,
  createFederalCountryBreadcrumbs,
  createFederalCountryUri,
  createNavigation as createCityNavigation,
  createUri as createCityUri
} from "./city";

import { buildGraphQLQuery, formatTime } from "@/lib/actions";
import { getFragments, sideloadBlockData } from "@/components/Blocks";
import FRAGMENT_SAFE_HARBOURS from "@/components/Demands/SafeHarbour/fragment";
import FRAGMENT_MEDIA from "@/components/Media/fragment";

async function createGroupNavigation(blocks) {
  return blocks
    .map(({ __typename, ...block }) => {
      if (blockNameMatches(__typename, 'Heading')) {
        const { level, text } = block;

        if (level === 'h2') {
          const id = slugify(text, {
            strict: true,
            lower: true
          });

          return {
            url: `#${id}`,
            label: text
          };
        }
      }

      if (blockNameMatches(__typename, 'Richtext')) {
        const processor = unified().use(markdown).use(extractToc);
        const node = processor.parse(block.richtext);
        const tree = processor.runSync(node);

        return tree
          .map(({ depth, value }) => {
            if (depth === 3 && value) {
              const id = slugify(value, {
                strict: true,
                lower: true
              });

              return {
                url: `#${id}`,
                label: value
              };
            }
          })
          .filter(Boolean);
      }
    })
    .flat()
    .filter(Boolean);
}

export async function fetchLatestGroupPaths(locale, options) {
  const { cities } = await fetchAPI(
    `
    query AllGroupPaths {
      cities (
        filters: {
           group: { id: {notNull: true }},
           safe_harbour: { id: { notNull: true }}
         }
         first: 10, orderBy: {createdAt: DESC} 
      ) {data{attributes{
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
      }}}
    }
  `,
    options
  );

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
          const citySlug = await createCityUri(
            uriObject,
            {
              prefix: '',
              safeHarbourFallback: false,
              locale
            },
            options
          );

          paths.push({
            locale,
            params: {
              slug: citySlug.split('/').filter(Boolean)
            }
          });
        }

        if (safe_harbour) {
          const safeHarbourSlug = await createCityUri(
            uriObject,
            {
              prefix: '',
              child: 'safe-harbour',
              locale
            },
            options
          );

          paths.push({
            locale,
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

export async function fetchAllCountryPaths(locale, options) {
  const { countries } = await fetchAPI(
    `
    query AllCountryPaths {
      countries {data{attributes{
        slug
        content {
          __typename
        }
      }}}
    }
  `,
    options
  );

  return countries
    .map(({ slug, content }) => {
      if (!content || content.length === 0) {
        return null;
      }

      return {
        locale,
        params: {
          slug: [slug]
        }
      };
    })
    .filter(Boolean);
}

export async function fetchAllFederalCountryPaths(locale, options) {
  const { countries } = await fetchAPI(
    `
    query AllFederalCountryPaths {
      countries {data{attributes{
        slug

        federal_countries {data{attributes{
          slug
          content {
            __typename
          }
        }}}
      }}}
    }`,
    options
  );

  return countries.reduce((acc, country) => {
    const { slug: countrySlug, federal_countries } = country;

    if (federal_countries) {
      federal_countries.forEach(({ slug, content }) => {
        if (content && content.length > 0) {
          acc.push({
            locale,
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

async function fetchAllCities(locale, options) {
  const { cities } = await fetchAPI(
    `
    query AllCities {
      cities(
        locale: "${locale}",
        pagination: { pageSize: 100000 }
      ) {data{
        id
      attributes{
        name
        slug
        is_city_state
        coordinates

        group {data{
          id
        }}

        safe_harbour {data{attributes{
          since
          demands {
            ${FRAGMENT_SAFE_HARBOURS}
          }
        }}}

        federal_country {data{attributes{
          name
          slug
          content {
            __typename
          }

          country {data{attributes{
            name
            slug
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

  return cities.map(({ coordinates, ...city }) => ({
    ...city,
    coordinates: toMapboxCoordinates(coordinates)
  }));
}

async function fetchGroup(citySlug, locale, formatting, options) {
  const { cities } = await fetchAPI(
    `
    query GroupBySlug {
      cities(filters: { slug: {eq:"${citySlug}"}}, locale: "${locale}") {data{attributes{
        name
        slug

        group {data{
          id
          
          attributes{
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
            }}
        }}

        safe_harbour {data{
          id
          attributes{
            since
        }}
      }}}}
    }
  `,
    options
  );

  const city = cities[0];

  if (!city?.group) {
    return null;
  }

  const actionsQuery = buildGraphQLQuery(
    [
      'title',
      'slug',
      'intro',
      'start',
      'hide_start_time',
      'slug',
      'location',
      'location_detail',
      'coordinates'
    ],
    [
      {
        key: 'group',
        value: {
          key: 'id',
          value: { eq: city.group.id }
        }
      }
    ],
    null,
    locale
  );

  const { actions } = await fetchAPI(actionsQuery, options);

  city.group.actions = actions || [];

  city.group.actions = actions.map(({ coordinates, start, hide_start_time, ...action }) => ({
    ...action,
    start: formatTime(start, hide_start_time ? formatting.date : formatting.dateTime),
    coordinates: toMapboxCoordinates(coordinates)
  }));

  city.group = await sideloadBlockData(
    city.group,
    'content',
    formatting,
    options
  );
  city.group.headlines = await createGroupNavigation(city.group.content);

  return city;
}

async function fetchCountry(countrySlug, locale, formatting, options) {
  const { countries } = await fetchAPI(
    `
    query CountryBySlug {
      countries(filters: { slug: {eq:"${countrySlug}"}}, locale: "${locale}") {data{attributes{
        name

        content {
          __typename

          ${getFragments({
      exclude: ['SubNavigation', 'Fundraisingbox']
    })}
        }
      }}}
    }
  `,
    options
  );

  const country = countries[0];

  if (!country) {
    return null;
  }

  return await sideloadBlockData(country, 'content', formatting, options);
}

async function fetchFederalCountry(countrySlug, locale, formatting, options) {
  const { federalCountries } = await fetchAPI(
    `
    query FederalCountryBySlug {
      federalCountries(filters: { slug: {eq:"${countrySlug}"}}, locale:"${locale}") {data{attributes{
        name

        demands {
          ${FRAGMENT_SAFE_HARBOURS}
        }

        content {
          __typename

          ${getFragments({
      exclude: ['SubNavigation', 'Fundraisingbox']
    })}
        }
      }
    }}}
  `,
    options
  );

  const federalCountry = federalCountries[0];

  if (!federalCountry) {
    return null;
  }

  return await sideloadBlockData(
    federalCountry,
    'content',
    formatting,
    options
  );
}

async function fetchSafeHarbour(citySlug, locale, formatting, options) {
  const { cities } = await fetchAPI(
    `
    query SafeHarbourByCitySlug {
      cities( filters: { slug: {eq:"${citySlug}"} }, locale:"${locale}") {data{attributes{
        name
        slug

        group {data{
          id
        }}

        federal_country {data{attributes{
          name
        }}}

        safe_harbour {data{attributes{
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
        }}}
      }}}
    }
  `,
    options
  );

  const city = cities[0];
  city.safe_harbour = await sideloadBlockData(
    city?.safe_harbour,
    'content',
    formatting,
    options
  );

  if (city?.safe_harbour?.since) {
    city.safe_harbour.since = format(
      new Date(city.safe_harbour.since),
      formatting.date
    );
  }

  if (city?.safe_harbour?.demands?.last_updated) {
    city.safe_harbour.demands.last_updated = format(
      new Date(city.safe_harbour.demands.last_updated),
      formatting.date
    );
  }

  return city;
}

async function createCountryCityStructure(cities, locale, options) {
  return await cities.reduce(async (accPromise, city) => {
    let acc = await accPromise || [];

    const { slug, federal_country, safe_harbour, ...cityProps } = city;
    const uri = await createCityUri(slug, { locale }, options);

    if (safe_harbour) {
      safe_harbour.uri = await createCityUri(
        slug,
        {
          child: 'safe-harbour',
          locale
        },
        options
      );
    }

    let countryEntry = acc.find(c => c.name === federal_country?.country?.name);
    if (!countryEntry) {
      countryEntry = { name: federal_country?.country?.name, federalCountries: [] };

      if (federal_country?.country?.content?.length > 0) {
        countryEntry.uri = await createCountryUri(
          federal_country.country.slug,
          locale,
          options
        );
      }

      acc.push(countryEntry);
    }

    let federalEntry = countryEntry.federalCountries.find(f => f.name === federal_country?.name);
    if (!federalEntry) {
      federalEntry = { name: federal_country?.name, cities: [] };

      if (federal_country?.content?.length > 0) {
        federalEntry.uri = await createFederalCountryUri(federal_country.slug, locale, options);
      }

      countryEntry.federalCountries.push(federalEntry);
    }

    federalEntry.cities.push({ ...cityProps, safe_harbour, uri });

    return acc;
  }, Promise.resolve([]));
}

async function createLocalCityStructure(cities, locale, options) {
  return await cities.reduce(async (accPromise, city) => {
    const acc = await accPromise;
    const { slug, federal_country, safe_harbour, ...cityProps } = city;
    const uri = await createCityUri(
      slug,
      {
        locale
      },
      options
    );

    if (safe_harbour) {
      safe_harbour.uri = await createCityUri(
        slug,
        {
          child: 'safe-harbour',
          locale
        },
        options
      );
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
          federal_country.country.slug,
          locale,
          options
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
        name: federalCountryName,
        cities: []
      };

      if (federalCountryHasContent) {
        acc[countryName].countries[federalCountryName].uri =
          await createFederalCountryUri(federal_country.slug, locale, options);
      }
    }

    acc[countryName].countries[federalCountryName].cities.push(fullCityProps);

    return acc;
  }, Promise.resolve({}));
}

export async function fetchAllGroups(locale, options) {
  const cities = await fetchAllCities(locale, options);
  const citiesWithGroup = cities
    .filter(({ group }) => !!group)
    .map((city) => {
      // We don't need that info on the client
      city.safe_harbour = null;
      return city;
    });

  return await createCountryCityStructure(citiesWithGroup, locale, options);
}

export async function fetchAllSafeHarbours(locale, formatting, options) {
  const cities = await fetchAllCities(locale, options);
  const citiesWithSafeHarbour = cities
    .filter(({ safe_harbour }) => !!safe_harbour)
    .map(({ safe_harbour, ...city }) => {
      const { demands } = safe_harbour;

      safe_harbour.demands_fullfilled =
        demands &&
        Object.keys(demands)
          .filter((key) => key.endsWith('_fullfilled'))
          .filter((key) => !!demands[key]).length;

      safe_harbour.demands_count = 8; // TODO
      safe_harbour.since =
        safe_harbour?.since &&
        format(new Date(safe_harbour.since), formatting.date);

      return {
        ...city,
        safe_harbour
      };
    });

  return await createCountryCityStructure(citiesWithSafeHarbour, locale);
}

async function fetchData(slug = [], locale, formatting, options) {
  switch (slug.length) {
    // /[country]/
    case 1: {
      const country = await fetchCountry(
        slug[slug.length - 1],
        locale,
        formatting,
        options
      );

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
      const city = await fetchGroup(lastSlug, locale, formatting, options);
      const navigation = await createCityNavigation(lastSlug, locale, options);
      let breadcrumbs = await createCityBreadcrumbs(lastSlug, locale, options);

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

      const federalCountry = await fetchFederalCountry(
        lastSlug,
        locale,
        formatting,
        options
      );
      breadcrumbs = await createFederalCountryBreadcrumbs(
        lastSlug,
        locale,
        options
      );

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
      let citySlug = slug[slug.length - 1];
      const city = await fetchGroup(citySlug, locale, formatting, options);
      let breadcrumbs = await createCityBreadcrumbs(citySlug, locale, options);
      let navigation = await createCityNavigation(citySlug, locale, options);

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

      citySlug = slug[slug.length - 2];
      const safeHarbour = await fetchSafeHarbour(
        citySlug,
        locale,
        formatting,
        options
      );
      breadcrumbs = await createCityBreadcrumbs(citySlug, locale, options);
      navigation = await createCityNavigation(citySlug, locale, options);

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
      const breadcrumbs = await createCityBreadcrumbs(
        citySlug,
        locale,
        options
      );
      const city = await fetchSafeHarbour(
        citySlug,
        locale,
        formatting,
        options
      );
      const navigation = await createCityNavigation(citySlug, locale, options);

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

export async function query(slug, locale, formatting, options) {
  return await fetchData(slug, locale, formatting, options);
}
