import { fetchAPI } from '@/lib/api';
import { extractImage, mergeMetadata } from '@/lib/metadata';
import { getLocalizedSlug } from '@/lib/slug';

import { getFragments, sideloadBlockData } from '@/components/Blocks';
import METADATA_FRAGMENT from '@/components/SEO/fragment';

export async function createPageLink(idOrPage, locale) {
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
    const prefix = await getLocalizedSlug('news/campaigns', locale);

    return [...prefix.split('/'), campaign.slug, slug];
  }

  return [slug];
}

async function fetchPaths(locale) {
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

  return await Promise.all(pages.map((page) => createPageLink(page, locale)));
}

export async function getPage(slug, parent, locale) {
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

async function queryAPI(slug = [], locale) {
  let lastSlug = slug.length > 1 ? slug[slug.length - 1] : slug;
  let parents = slug.length > 1 ? slug.slice(0, slug.length - 1) : null;

  // homepage
  if (slug.length === 0) {
    lastSlug = '/';
  }

  const page = await getPage(lastSlug, parents, locale);

  const data = page
    ? {
        page
      }
    : null;

  return data;
}

export async function paths(locale) {
  return await fetchPaths(locale);
}

export async function query(slug, locale) {
  return {
    data: await queryAPI(slug, locale)
  };
}
