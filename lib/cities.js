import { fetchAPI } from './api';
import { slugsToUri } from './slug';

async function getCity(slug) {
  const uri = slugsToUri(slug, {
    prefix: 'cities'
  });

  const data = await fetchAPI(`
    query {
      city(id: "${uri}", idType: URI) {
        title
      }
    }
  `);

  return data;
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

async function queryAPI(slug = []) {
  switch (slug.length) {
    // /[federal-country]/
    case 1:
      const cities = await getCities(slug);

      return {
        type: 'list-cities',
        data: {
          cities
        }
      };

    // /[federal-country]/[city]/
    case 2:
      const child = await getFirstCityChild(slug);
      const destination = slugsToUri(slug, {
        prefix: 'take-part',
        appendix: child.slug
      });

      return {
        type: 'redirect',
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
        type: 'page',
        data
      };

    default:
      return null;
  }
}

export async function query(slug) {
  const data = await queryAPI(slug);

  return data;
}
