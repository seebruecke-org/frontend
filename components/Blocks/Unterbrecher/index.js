export { default } from './Unterbrecher';

import { FRAGMENT as FRAGMENT_MEDIA } from '@/components/Media';
import { FRAGMENT as FRAGMENT_TITLE } from '@/components/Blocks/Heading';
import { FRAGMENT as FRAGMENT_LINK } from '@/components/StrapiLink';

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
      ${FRAGMENT_LINK}
    }

    uMedia: media {
      ${FRAGMENT_MEDIA}
    }
  }
`;
