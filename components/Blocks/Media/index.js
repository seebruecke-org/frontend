export { default } from './Media';

import { FRAGMENT as MEDIA_FRAGMENT } from '@/components/Media';

export const FRAGMENT = `
  ... on ComponentSharedBlocksMedia {
    image {
      ${MEDIA_FRAGMENT}
    }
  }
`;
