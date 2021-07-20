import isRelativeUrl from 'is-relative-url';
import json5 from 'json5';

import { createPageLink } from './pages';

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
    const data = json5.parse(link);
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
        }
        break;
    }

    if (!url) {
      return {};
    }

    return {
      label: label || title,
      url: `/${url.toLocaleLowerCase()}`
    };
  } catch (err) {
    console.log(err);
    console.log(link);

    return link;
  }
}
