import { SLUG_REWRITES } from './constants';

export function getLocalizedSlug(slug, locale = 'en') {
  if (locale === 'en') {
    return slug;
  }

  return SLUG_REWRITES[slug][locale];
}

export function slugsToUri(slugs = [], options = {}) {
  let { prefix = '', appendix = '', locale = null } = options;
  const result = [];

  const getLocalized = (slug, locale) => {
    let localized = '';

    if (locale) {
      localized = `${getLocalizedSlug(slug, locale)}`;
    } else {
      localized = `${slug}`;
    }

    return localized;
  };

  if (prefix) {
    result.push(getLocalized(prefix, locale));
  }

  slugs.forEach((slug) => result.push(slug));

  if (appendix) {
    result.push(appendix);
  }

  return result.length === 0 ? '/' : `/${result.join('/')}/`;
}

function normalizePathSlashes(path) {
  let normalized = path;

  if (!normalized.endsWith('/')) {
    normalized = `${normalized}/`;
  }

  return normalized;
}

export function arePathsEqual(pathA, pathB) {
  return normalizePathSlashes(pathA) === normalizePathSlashes(pathB);
}
