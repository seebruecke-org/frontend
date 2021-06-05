import { fetchAPI } from './api';
import { extractImage, mergeMetadata } from '@/lib/metadata';

import { getFragments, sideloadBlockData } from '@/components/Blocks';
import { FRAGMENT as METADATA_FRAGMENT } from '@/components/SEO';

export async function createPageLink(idOrPage) {
  const slugs = await import('@/locales/de/slugs.json');

  const fetchPage = (id) =>
    fetchAPI(`
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

  const { page } =
    typeof idOrPage !== 'object'
      ? await fetchPage(idOrPage)
      : { page: idOrPage };

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

  return await Promise.all(pages.map((page) => createPageLink(page)));
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

        campaign {
          id
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

  if (page) {
    const contentImage = extractImage(page?.content);

    page.metadata = mergeMetadata(page.metadata, {
      title: page.title,
      facebook_image: contentImage && `${contentImage}&size=facebook`,
      twitter_image: contentImage && `${contentImage}&size=twitter`
    });
  }

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
  return await fetchPaths();
}

export async function query(slug, locale) {
  return {
    data: await queryAPI(slug, locale)
  };
}
