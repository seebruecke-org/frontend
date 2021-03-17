import { fetchAPI } from './api';

import { getFragments, sideloadBlockData } from '../components/Blocks';
import { FRAGMENT as METADATA_FRAGMENT } from '@/components/SEO';

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

  return pages.map(({ slug, parent }) => {
    if (parent) {
      return `${parent.slug}/${slug}`;
    }

    return slug;
  });
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

        metadata {
          ${METADATA_FRAGMENT}
        }
      }
    }
  `);

  let page = await sideloadBlockData(pages[0] || null, 'content');

  return page;
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
