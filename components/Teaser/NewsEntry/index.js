export { default } from './NewsEntry';

import FRAGMENT_MEDIA from '@/components/Media/fragment';

export const FRAGMENT = `
  ... on NewsEntry {
    id
    title
    slug
    type
    publication_date
    image {
      ${FRAGMENT_MEDIA}
    }
  }
`;
