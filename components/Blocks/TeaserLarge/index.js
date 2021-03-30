import TeaserLarge from './TeaserLarge';
import { FRAGMENT as FRAGMENT_LINK } from '@/components/StrapiLink';

export default TeaserLarge;

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

export const block = {
  name: 'TeaserLarge',
  Component: TeaserLarge,
  Fragment: FRAGMENT
};
