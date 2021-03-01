import { fetchAPI } from './api';

export async function createUri(citySlug, options = {}) {
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
    let uri = `/${prefix}/${countrySlug}`;

    if (isCityState) {
      uri = `${uri}/${slug}`;
    } else {
      uri = `${uri}/${federalCountrySlug}/${slug}`;
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

export async function createNavigation(slug) {
  if (!slug) {
    return null;
  }

  const navigation = [];

  const { cities } = await fetchAPI(`
    query {
      cities(where: { slug: "${slug}"}) {
        group {
          id
        }

        safe_harbour {
          id
        }
      }
    }
  `);

  const city = cities[0] || {};
  const { group, safe_harbour } = city;

  if (group) {
    const uri = await createUri(slug);

    navigation.push({
      path: uri,
      label: 'Lokalgruppe'
    });
  }

  if (safe_harbour) {
    const uri = await createUri(slug, {
      child: 'safe-harbour'
    });

    navigation.push({
      path: uri,
      label: 'Sicherer Hafen'
    });
  }

  return navigation;
}
