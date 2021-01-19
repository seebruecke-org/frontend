export { default } from './StageLarge';

import { FRAGMENT as FRAGMENT_IMAGE } from '@/components/Image';

export const FRAGMENT = `
  ... on ComponentSharedBlocksStageLarge {
    title
    image {
      caption
      image {
        ${FRAGMENT_IMAGE}
      }
    }
  }
`;
