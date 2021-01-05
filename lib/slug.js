import { SLUG_REWRITES } from './constants';

export function getLocalizedSlug(slug, locale = 'en') {
  if (locale === 'en') {
    return slug;
  }

  return SLUG_REWRITES[slug][locale];
}

export function slugsToUri(slugs, options = {}) {
  let { prefix = '', appendix = '', locale = null } = options;

  const getLocalized = (slug, locale) => {
    let localized = '';

    if (locale) {
      localized = `${getLocalizedSlug(slug, locale)}`;
    } else {
      localized = `${slug}`;
    }

    return localized;
  }

  if (prefix) {
    prefix = `/${getLocalized(prefix, locale)}`;
  }

  if (appendix) {
    appendix = `${appendix}/`;
  }

  return `${prefix}/${slugs.join('/')}/${appendix}`;
}
