import { fetchAPI } from './api';
import { slugsToUri } from './slug';

import { getFragments } from '../components/Blocks';

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

export async function query(slug, locale) {
  const data = await queryAPI(slug, locale);

  return {
    data
  };
}
