export { default } from './Unterbrecher';

import { FRAGMENT as FRAGMENT_IMAGE } from '@/components/Image';
import { FRAGMENT as FRAGMENT_TITLE } from '@/components/Blocks/Heading';
import { FRAGMENT as FRAGMENT_CTA } from '@/components/CTA';

export const FRAGMENT = `
  ... on ComponentSharedBlocksUnterbrecher {
    uTitle: title {
      ${FRAGMENT_TITLE}
    }

    intro
    reversed: orientation_reversed
    type
    size

    uCta: cta {
      ${FRAGMENT_CTA}
    }

    uMedia: media {
      ${FRAGMENT_IMAGE}
    }
  }
`;
