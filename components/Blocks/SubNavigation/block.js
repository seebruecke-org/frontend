import FRAGMENT_LINK from '@/components/StrapiLink/fragment';

export const FRAGMENT = `
  ... on ComponentSharedBlocksSubNavigation {
    csbsn_items: items {
      ${FRAGMENT_LINK}
    }
  }
`;


export default {
  name: 'SubNavigation',
  Fragment: FRAGMENT,
};
