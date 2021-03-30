import StageLarge from './StageLarge';
import { FRAGMENT as FRAGMENT_LINK } from '@/components/StrapiLink';
import { FRAGMENT as FRAGMENT_MEDIA } from '@/components/Media';

export default StageLarge;

export const FRAGMENT = `
  ... on ComponentSharedBlocksStageLarge {
    title

    image {
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

export const block = {
  name: 'StageLarge',
  Component: StageLarge,
  Fragment: FRAGMENT
};
