import { fetchAPI } from './api';

import { getFragments, sideloadBlockData } from '@/components/Blocks';
import { FRAGMENT as METADATA_FRAGMENT } from '@/components/SEO';

export async function createPageLink(id) {
  const { slugs } = await import('../public/locales/de/common.json');
  const { page } = await fetchAPI(`
    query PagePaths {
      page(id: ${id}) {
        slug

        parent {
          slug
        }

        campaign {
          slug
        }
      }
    }
  `);

  if (!page) {
    return null;
  }

  const { slug, parent, campaign } = page;

  if (slug === '/') {
    return [];
  }

  if (parent) {
    return [parent.slug, slug];
  }

  if (campaign) {
    return [...slugs['news/campaigns'].split('/'), campaign.slug, slug];
  }

  return [slug];
}

async function fetchPaths() {
  const { pages } = await fetchAPI(`
    query PagePaths {
      pages {
        id
      }
    }
  `);

  return await Promise.all(pages.map(({ id }) => createPageLink(id)));
}

export async function getPage(slug, parent) {
  const { pages } = await fetchAPI(`
    query {
      pages(where: { slug: "${slug}" }) {
        title
        content {
          __typename

          ${getFragments()}
        }

        parent {
          slug
        }

        metadata {
          ${METADATA_FRAGMENT}
        }
      }
    }
  `);

  // It is possible to have teh same slug twice, if pages are nested,
  // therefore we have the find the page with the proper parent here,
  // if one was passed through
  let page =
    pages.length > 1
      ? pages.find(({ parent: pageParent }) => {
          if (parent && pageParent) {
            return pageParent.slug === parent[0];
          }

          return pageParent === null;
        })
      : pages[0] || null;

  return await sideloadBlockData(page, 'content');
}

async function queryAPI(slug = []) {
  let lastSlug = slug.length > 1 ? slug[slug.length - 1] : slug;
  let parents = slug.length > 1 ? slug.slice(0, slug.length - 1) : null;

  // homepage
  if (slug.length === 0) {
    lastSlug = '/';
  }

  const page = await getPage(lastSlug, parents);

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
