import FRAGMENT_MEDIA from '@/components/Media/fragment';

export const FRAGMENT = `
  ... on ComponentSharedBlocksStageMedium {
    title
    kicker
    intro
    layout
    image {
      ${FRAGMENT_MEDIA}
    }
  }
`;

export default {
  name: 'StageMedium',
  Fragment: FRAGMENT
};
