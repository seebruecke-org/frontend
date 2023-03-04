import FRAGMENT_LINK from '@/components/StrapiLink/fragment';
import { FRAGMENT as FRAGMENT_HEADING } from '@/components/Blocks/Heading/block';
import FRAGMENT_MEDIA from '@/components/Media/fragment';

export const FRAGMENT = `
  ... on ComponentSharedBlocksStageLarge {
    heading {
      ${FRAGMENT_HEADING}
    }

    intro

    image {
      ${FRAGMENT_MEDIA}
    }

    csbsl_cta: cta {
      ${FRAGMENT_LINK}
    }

    subnavigation {
      ${FRAGMENT_LINK}
    }
  }
`;


export default {
  name: 'StageLarge',
  Fragment: FRAGMENT
};
