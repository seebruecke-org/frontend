import { fetchAPI } from './api';
import { slugsToUri } from './slug';
import { getLocalizedSlug } from './slug';

import { PARAGRAPH_FRAGMENT, HEADING_FRAGMENT } from '../components/Blocks';

export function getLocalizedFrontpageSlug(locale) {
  return getLocalizedSlug('/en', locale);
}

export async function getPage(slug) {
  const uri = slugsToUri(slug, {
    prefix: 'cities'
  });

  const { page } = await fetchAPI(`
    query {
      page(id: "${uri}", idType: URI) {
        title
        blocks {
          __typename

          ${PARAGRAPH_FRAGMENT}
          ${HEADING_FRAGMENT}
        }
      }
    }
  `);

  return page;
}

async function queryAPI(slug = []) {
  const page = await getPage(slug);

  const data = page ? {
    page,
  } : null;

  return data;
}

export async function query(slug, locale) {
  const data = await queryAPI(slug, locale);

  return {
    data
  };
}
