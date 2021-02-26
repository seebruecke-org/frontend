export { default } from './TeaserLarge';

import { FRAGMENT as FRAGMENT_CTA } from '@/components/CTA';

export const FRAGMENT = `
  ... on ComponentSharedBlocksTeaserLarge {
    title
    intro
    tType: type
    cta {
      ${FRAGMENT_CTA}
    }
  }
`;
