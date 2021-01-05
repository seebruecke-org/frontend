import { RETURN_CODES } from './constants';

import { fetchAPI } from './api';
import { slugsToUri } from './slug';

async function getCity(slug) {
  const uri = slugsToUri(slug, {
    prefix: 'cities'
  });

  const { city } = await fetchAPI(`
    query {
      city(id: "${uri}", idType: URI) {
        title
      }
    }
  `);

  return city;
}

async function getCities(slug) {
  const uri = slugsToUri(slug, {
    prefix: 'cities'
  });

  const data = await fetchAPI(`
    query {
      page: city(id: "${uri}", idType: URI) {
        children {
          nodes {
            ... on City {
              title
            }
          }
        }
      }
    }
  `);

  return data?.page?.children?.nodes;
}

async function getPage(slug) {
  const uri = slugsToUri(slug, {
    prefix: 'cities'
  });

  const { page } = await fetchAPI(`
    query {
      page: city(id: "${uri}", idType: URI) {
        title
      }
    }
  `);

  return page;
}

async function getFirstCityChild(slug) {
  const uri = slugsToUri(slug, {
    prefix: 'cities'
  });

  const data = await fetchAPI(`
    query {
      city(id: "${uri}", idType: URI) {
        children {
          nodes {
            slug
          }
        }
      }
    }
  `);

  return data?.city?.children?.nodes[0];
}

async function queryAPI(slug = [], locale) {
  switch (slug.length) {
    // /[federal-country]/
    case 1:
      const cities = await getCities(slug);

      return {
        data: {
          cities
        }
      };

    // /[federal-country]/[city]/
    case 2:
      const child = await getFirstCityChild(slug);

      if (!child?.slug) {
        return {
          type: RETURN_CODES.NOT_FOUND,
          data: null
        }
      }

      const destination = slugsToUri(slug, {
        prefix: 'take-part',
        appendix: child.slug,
        locale
      });

      return {
        type: RETURN_CODES.REDIRECT,
        destination
      };

    // /[federal-country]/[city]/[slug]/
    case 3:
      const city = await getCity(slug.slice(0, 2));
      const page = await getPage(slug);
      const data = page ? {
        city,
        page
      } : null;

      return {
        data
      };

    default:
      return null;
  }
}

export async function query(slug, locale) {
  const data = await queryAPI(slug, locale);

  return data;
}
