import FRAGMENT_LINK from '@/components/StrapiLink/fragment';

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

export default {
  name: 'TeaserLarge',
  Fragment: FRAGMENT,
};
