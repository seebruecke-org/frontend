import { BLOCK_PREFIX } from '@/lib/constants';
import { getFullClientUrl, getFullCMSUrl } from '@/lib/url';

export function mergeMetadata(defaults, data) {
  if (!defaults && !data) {
    return defaults;
  }

  const defaultData = defaults ?? {};
  const extendData = data ?? {};

  // run all metadata images, set in the backend, through the resize
  // lambda
  if (defaultData?.['twitter_image']?.url) {
    defaultData['twitter_image'].url = getFullClientUrl(
      `/api/resize/?url=${getFullCMSUrl(
        defaultData['twitter_image'].url
      )}&size=twitter`
    );
  }

  if (defaultData['facebook_image']?.url) {
    defaultData['facebook_image'].url = getFullClientUrl(
      `/api/resize/?url=${getFullCMSUrl(
        defaultData['facebook_image'].url
      )}&size=facebook`
    );
  }

  const fullData = Object.assign(
    extendData,
    Object.entries(defaultData).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = value;
      }

      return acc;
    }, {})
  );

  if (fullData['__typename']) {
    delete fullData['__typename'];
  }

  if (fullData?.twitter_image) {
    fullData['twitter_card'] = 'summary_large_image';
  }

  if (!fullData?.twitter_title && fullData?.title) {
    fullData.twitter_title = fullData.title;
  }

  if (!fullData?.twitter_description && fullData?.description) {
    fullData.twitter_description = fullData.description;
  }

  if (!fullData?.facebook_title && fullData?.title) {
    fullData.facebook_title = fullData.title;
  }

  if (!fullData?.facebook_description && fullData?.description) {
    fullData.facebook_description = fullData.description;
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

    if (normalizedValue) {
      acc[`${prefix}${normalizedKey}`] = normalizedValue;
    }

    return acc;
  }, {});
}

export function extractImage(blocks) {
  const image = blocks.reduce((acc, { __typename, ...props }) => {
    if (acc) {
      return acc;
    }

    let url = null;

    switch (__typename) {
      case `${BLOCK_PREFIX}StageLarge`:
      case `${BLOCK_PREFIX}Media`:
        url = props?.image?.media?.url;
        break;

      case `${BLOCK_PREFIX}MediaGallery`:
        url = props?.items?.[0]?.media?.url;
    }

    if (url) {
      acc = getFullClientUrl(`/api/resize/?url=${getFullCMSUrl(url)}`);
    }

    return acc;
  }, null);

  return image;
}
