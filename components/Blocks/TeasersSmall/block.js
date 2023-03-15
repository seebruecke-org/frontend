import FRAGMENT_LINK from '@/components/StrapiLink/fragment';

export const FRAGMENT = `
  ... on ComponentSharedBlocksTeasersSmall {
    items {
      title
      tsType: type
      link {
        ${FRAGMENT_LINK}
      }
    }
  }
`;

export default {
  name: 'TeasersSmall',
  Fragment: FRAGMENT
};
