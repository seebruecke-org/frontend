export { default } from './Media';

import { FRAGMENT as IMAGE_FRAGMENT } from '@/components/Image';

export const FRAGMENT = `
  ... on ComponentSharedBlocksMedia {
    description

    media {
      ${IMAGE_FRAGMENT}
    }
  }
`;
