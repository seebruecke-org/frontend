export { default } from './SubNavigation';

import { FRAGMENT as FRAGMENT_LINK } from '@/components/StrapiLink';

export const FRAGMENT = `
  ... on ComponentSharedBlocksSubNavigation {
    items {
      ${FRAGMENT_LINK}
    }
  }
`;
