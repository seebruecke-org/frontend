export { default } from './StageLarge';

import { FRAGMENT as FRAGMENT_LINK } from '@/components/StrapiLink';
import { FRAGMENT as FRAGMENT_MEDIA } from '@/components/Media';

export const FRAGMENT = `
  ... on ComponentSharedBlocksStageLarge {
    title

    media {
      ${FRAGMENT_MEDIA}
    }

    cta {
      ${FRAGMENT_LINK}
    }

    subnavigation {
      ${FRAGMENT_LINK}
    }
  }
`;
