import { fetchAPI } from './api';

import { getFragments } from '../components/Blocks';

async function fetchPaths() {
  const { pages } = await fetchAPI(`
    query PagePaths {
      pages {
        slug
      }
    }
  `);

  return pages;
}

export async function getPage(slug) {
  const { pages } = await fetchAPI(`
    query {
      pages(where: { slug: "${slug}" }) {
        title
        content {
          __typename

          ${getFragments()}
        }
      }
    }
  `);

  return pages[0];
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
