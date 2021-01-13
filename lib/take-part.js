import { RETURN_CODES } from './constants';

import { fetchAPI } from './api';
import { slugsToUri, getLocalizedSlug } from './slug';
import { enrichBlocks } from './blocks';

import { getFragments } from '@/components/Blocks';
import { FRAGMENT as FRAGMENT_IMAGE } from '@/components/Image';

async function fetchPaths() {
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

async function fetchChildCities(slug) {
  const uri = slugsToUri(slug, {
    prefix: 'cities'
  });

  const data = await fetchAPI(`
    query TakePartChildCities {
      city(id: "${uri}", idType: URI) {
        children {
          nodes {
            ... on City {
              title
              uri
            }
          }
        }
      }
    }
  `);

  return data?.city?.children?.nodes;
}

async function fetchPage(slug) {
  const uri = slugsToUri(slug, {
    prefix: 'cities'
  });

  const { page } = await fetchAPI(`
    query TakePartPage {
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

async function fetchPageChildren(slug, locale) {
  const uri = slugsToUri(slug, {
    prefix: 'cities'
  });

  const data = await fetchAPI(`
    query TakePartPageChildren {
      page: city(id: "${uri}", idType: URI) {
        children {
          nodes {
            ... on City {
              title
              uri
            }
          }
        }
      }
    }
  `);

  data.page.children.nodes = data.page.children.nodes.map(node => {
    return {
      ...node,
      uri: `/${getLocalizedSlug('take-part', locale)}/${node.uri.split('/').slice(2).join('/')}`
    };
  })

  return data?.page?.children?.nodes;
}

async function getFirstCityChild(slug) {
  const uri = slugsToUri(slug, {
    prefix: 'cities'
  });

  const data = await fetchAPI(`
    query TakePartFirstCityChild {
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

async function fetchData(slug = [], locale) {
  const page = await fetchPage(slug);

  switch (slug.length) {
    // /[federal-country]/
    case 1:
      const cities = await fetchChildCities(slug);

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
      const city = await fetchPage(slug.slice(0, 2));
      const siblings = await fetchPageChildren(slug.slice(0, 2), locale);
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
  const data = await fetchPaths();

  return data;
}

export async function query(slug, locale) {
  const data = await fetchData(slug, locale);

  return data;
}
