import { fetchAPI } from './api';
import { slugsToUri } from './slug';

import { getFragments } from '../components/Blocks';

async function fetchPaths() {
  const {
    pages: { nodes }
  } = await fetchAPI(`
    query PagePaths {
      pages(last: 1000) {
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

export async function getPage(slug) {
  const uri = slugsToUri(slug);

  const { page } = await fetchAPI(`
    query {
      page(id: "${uri}", idType: URI) {
        title
        blocks {
          __typename

          ${getFragments()}
        }
      }
    }
  `);

  return page;
}

async function queryAPI(slug = []) {
  const page = await getPage(slug);

  const data = page
    ? {
        page
      }
    : null;

  return data;
}

export async function paths() {
  const data = await fetchPaths();

  return data;
}

export async function query(slug, locale) {
  const data = await queryAPI(slug, locale);

  return {
    data
  };
}
