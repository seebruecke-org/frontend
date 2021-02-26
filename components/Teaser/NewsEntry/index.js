export { default } from './NewsEntry';

import { FRAGMENT as IMAGE_FRAGMENT } from '@/components/Image';

export const FRAGMENT = `
  ... on NewsEntry {
    id
    title
    slug
    type
    publishedAt: published_at
    image {
      image {
        ${IMAGE_FRAGMENT}
      }
    }
  }
`;
