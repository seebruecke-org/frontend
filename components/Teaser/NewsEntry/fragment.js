import FRAGMENT_MEDIA from '@/components/Media/fragment';

export default `
  ... on NewsEntry {
    metadata {
      id
    }
    title
    slug
    type
    publishedAt
    publication_date
    image {
      ${FRAGMENT_MEDIA}
    }
  }
`;
