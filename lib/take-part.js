import { RETURN_CODES } from './constants';

import { fetchAPI } from './api';
import { slugsToUri } from './slug';
import { enrichBlocks } from './blocks';

import { getFragments } from '@/components/Blocks';
import { FRAGMENT as FRAGMENT_IMAGE } from '@/components/Image';

async function getPaths() {
  const { cities: { nodes }} = await fetchAPI(`
    query TakePartPaths {
      cities {
        nodes {
          uri
          language {
            slug
          }
        }
      }
    }
  `);

  return nodes;
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
              slug
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

        featuredImage {
          node {
            ${FRAGMENT_IMAGE}
          }
        }

        blocks {
          __typename

          ${getFragments()}
        }
      }
    }
  `);

  page.blocks = await enrichBlocks(page?.blocks);

  return page;
}

async function getPageChildren(slug) {
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
              slug
            }
          }
        }
      }
    }
  `);

  return data?.page?.children?.nodes;
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
  const page = await getPage(slug);

  switch (slug.length) {
    // /[federal-country]/
    case 1:
      const cities = await getCities(slug);

      return {
        data: {
          page,
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
      const city = await getPage(slug.slice(0, 2));
      const siblings = await getPageChildren(slug.slice(0, 2));
      const data = page ? {
        city,
        page,
        siblings
      } : null;

      return {
        data
      };

    default:
      return null;
  }
}

export async function paths() {
  const data = await getPaths();

  return data;
}

export async function query(slug, locale) {
  const data = await queryAPI(slug, locale);

  return data;
}
