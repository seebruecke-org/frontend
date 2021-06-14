function normalizePathSlashes(path) {
  let normalized = path;

  if (!normalized) {
    return path;
  }

  if (!normalized.endsWith('/')) {
    normalized = `${normalized}/`;
  }

  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }

  return normalized.toLocaleLowerCase();
}

export function arePathsEqual(pathA, pathB) {
  return normalizePathSlashes(pathA) === normalizePathSlashes(pathB);
}

export function getSlugFromI18nNext(slug, locale, i18nNextObj) {
  return i18nNextObj._nextI18Next.initialI18nStore[locale].slugs[slug];
}
