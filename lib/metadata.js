export function mergeMetadata(defaults, data) {
  if (!defaults && !data) {
    return defaults;
  }

  const defaultData = defaults ?? {};
  const extendData = data ?? {};

  const fullData = Object.assign(
    defaultData,
    Object.entries(extendData).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = value;
      }

      return acc;
    }, {})
  );

  if (fullData?.twitter_image) {
    fullData['twitter_card'] = 'summary_large_image';
  }

  fullData['twitter_site'] = '_Seebruecke_';

  return Object.entries(fullData).reduce((acc, [key, value]) => {
    let prefix = '';
    let normalizedKey = key;
    let normalizedValue = value;

    if (key.startsWith('facebook_')) {
      prefix = 'og:';
    } else if (key.startsWith('twitter_')) {
      prefix = 'twitter:';
    }

    if (prefix === 'twitter:' || prefix === 'og:') {
      normalizedKey = normalizedKey.split('_')[1];
    }

    if ((key === 'facebook_image' || key === 'twitter_image') && value?.url) {
      normalizedValue = value.url;
    }

    acc[`${prefix}${normalizedKey}`] = normalizedValue;

    return acc;
  }, {});
}
