import isRelativeUrl from 'is-relative-url';

import { fetchAPI } from './api';

const INTERNAL_HOSTS = ['seebruecke.org', 'seebruecke-org.vercel.app'];

export function isInternal(url) {
  const isRelative = isRelativeUrl(url);

  if (isRelative) {
    return true;
  }

  const containsHost = INTERNAL_HOSTS.reduce((acc, host) => {
    if (url.includes(host)) {
      acc = true;
    }

    return acc;
  }, true);

  return !isRelative && url && containsHost;
}

export async function fetchLink(link) {
  if (!link) {
    return link;
  }

  try {
    const data = JSON.parse(link);
    const { contentType, id } = data;
    let url = null;

    if (contentType && id) {
      const content = await fetchAPI(`
        query {
          ${contentType}(id: ${id}) {
            slug
            title

            parent {
              slug
            }
          }
        }
      `);

      if (content?.page?.slug) {
        url = `/${content?.page?.slug}`;
      }

      if (content?.page?.parent?.slug) {
        url = `/${content.page.parent.slug}/${content.page.slug}`;
      }

      if (!url) {
        return data;
      }

      return {
        ...data,
        label: link.label || content?.page?.title,
        url: url.toLocaleLowerCase()
      };
    }

    return data;
  } catch (err) {
    console.log(err);
    return link;
  }
}
