export { default } from './NewsEntry';

import { FRAGMENT as FRAGMENT_MEDIA } from '@/components/Media';

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
