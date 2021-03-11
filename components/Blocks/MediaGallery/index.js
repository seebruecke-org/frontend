export { default } from './MediaGallery';

import { FRAGMENT as FRAGMENT_IMAGE } from '@/components/Image';

export const FRAGMENT = `
  ... on ComponentSharedBlocksMediaGallery {
    items {
      caption
      media {
        ${FRAGMENT_IMAGE}
      }
    }
  }
`;
