import FRAGMENT_MEDIA from '@/components/Media/fragment';

export default `
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
