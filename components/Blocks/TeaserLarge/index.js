export { default } from './TeaserLarge';

import { FRAGMENT as FRAGMENT_LINK } from '@/components/StrapiLink';

export const FRAGMENT = `
  ... on ComponentSharedBlocksTeaserLarge {
    title
    intro
    tType: type
    cta {
      ${FRAGMENT_LINK}
    }
  }
`;
