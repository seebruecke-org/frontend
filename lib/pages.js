import { fetchAPI } from './api';

import { getFragments } from '../components/Blocks';
import { slugsToUri } from './slug';

async function fetchPaths() {
  const { pages } = await fetchAPI(`
    query PagePaths {
      pages {
        slug

        parent {
          slug
        }
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
  const lastSlug = slug.length > 1 ? slug[slug.length - 1] : slug;
  const page = await getPage(lastSlug);

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
