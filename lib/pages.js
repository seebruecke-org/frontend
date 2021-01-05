import { getLocalizedSlug } from './slug';

export function getLocalizedFrontpageSlug(locale) {
  return getLocalizedSlug('/en', locale);
}
