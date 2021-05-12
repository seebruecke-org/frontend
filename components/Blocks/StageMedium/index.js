import StageMedium from './StageMedium';
import { FRAGMENT as FRAGMENT_MEDIA } from '@/components/Media';

export default StageMedium;

export const FRAGMENT = `
  ... on ComponentSharedBlocksStageMedium {
    title
    kicker
    intro
    image {
      ${FRAGMENT_MEDIA}
    }
  }
`;

export const block = {
  name: 'StageMedium',
  Fragment: FRAGMENT
};
