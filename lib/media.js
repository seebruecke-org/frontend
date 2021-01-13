import { fetchAPI } from './api';

import { FRAGMENT as IMAGE_FRAGMENT } from '@/components/Image';

export async function fetchMedia(id) {
  const media = await fetchAPI(`
    query {
      mediaItem(id: "${id}", idType: DATABASE_ID) {
        ${IMAGE_FRAGMENT}
      }
    }
  `);

  return media;
}
