import Media from './Media';
import { FRAGMENT as MEDIA_FRAGMENT } from '@/components/Media';

export default Media;

export const FRAGMENT = `
  ... on ComponentSharedBlocksMedia {
    image {
      ${MEDIA_FRAGMENT}
    }
  }
`;

export const block = {
  name: 'Media',
  Component: Media,
  Fragment: FRAGMENT
};
