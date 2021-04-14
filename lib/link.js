import isRelativeUrl from 'is-relative-url';

import { fetchAPI } from './api';
import { createPageLink } from './pages';

const INTERNAL_HOSTS = ['seebruecke.org', 'seebruecke-org.vercel.app'];
const CACHE = {};

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
  if (CACHE[link]) {
    return CACHE[link];
  }

  if (!link) {
    return link;
  }

  try {
    const data = JSON.parse(link);
    const { contentType, id, label } = data;
    let url = null;
    let title = null;

    if (!contentType || !id) {
      return data;
    }

    switch (contentType) {
      case 'page':
        {
          url = await createPageLink(id);

          if (url) {
            url = url.join('/');
          }

          const { page } = await fetchAPI(`query {
                page(id: ${id}) {
                  title
                }
              }
            `);

          title = page?.title;
        }
        break;
    }

    if (!url) {
      return data;
    }

    CACHE[link] = {
      ...data,
      label: label || title,
      url: `/${url.toLocaleLowerCase()}`
    };

    return CACHE[link];
  } catch (err) {
    console.log(err);
    return link;
  }
}
