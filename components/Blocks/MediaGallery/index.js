export { default } from './MediaGallery';

import { FRAGMENT as FRAGMENT_MEDIA } from '@/components/Media';

export const FRAGMENT = `
  ... on ComponentSharedBlocksMediaGallery {
    items {
      ${FRAGMENT_MEDIA}
    }
  }
`;
