export { default } from './StageMedium';

import { FRAGMENT as FRAGMENT_IMAGE } from '@/components/Image';

export const FRAGMENT = `
  ... on ComponentSharedBlocksStageMedium {
    title
    kicker
    intro
    image {
      caption
      image {
        ${FRAGMENT_IMAGE}
      }
    }
  }
`;
