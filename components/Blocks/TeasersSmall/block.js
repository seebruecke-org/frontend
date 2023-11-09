import FRAGMENT_LINK from '@/components/StrapiLink/fragment';

export const FRAGMENT = `
  ... on ComponentSharedBlocksTeasersSmall {
    columns
    items {
      title
      text
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
