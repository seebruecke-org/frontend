import { fetchAPI } from './api';

import { getFragments, sideloadBlockData } from '@/components/Blocks';
import { FRAGMENT as METADATA_FRAGMENT } from '@/components/SEO';

async function fetchPaths() {
  const { slugs } = await import('../public/locales/de/common.json');
  const { pages } = await fetchAPI(`
    query PagePaths {
      pages {
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

  return pages.map(({ slug, parent, campaign }) => {
    if (parent) {
      return [parent.slug, slug];
    }

    if (campaign) {
      return [...slugs['news/campaigns'].split('/'), campaign.slug, slug];
    }

    if (slug === '/') {
      return [];
    }

    return [slug];
  });
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
