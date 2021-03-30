import SubNavigation from './SubNavigation';
import { FRAGMENT as FRAGMENT_LINK } from '@/components/StrapiLink';

export default SubNavigation;

export const FRAGMENT = `
  ... on ComponentSharedBlocksSubNavigation {
    items {
      ${FRAGMENT_LINK}
    }
  }
`;

export const block = {
  name: 'SubNavigation',
  Component: SubNavigation,
  Fragment: FRAGMENT
};
