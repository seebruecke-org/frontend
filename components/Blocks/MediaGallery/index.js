import MediaGallery from './MediaGallery';
import { FRAGMENT as FRAGMENT_MEDIA } from '@/components/Media';

export default MediaGallery;

export const FRAGMENT = `
  ... on ComponentSharedBlocksMediaGallery {
    items {
      ${FRAGMENT_MEDIA}
    }
  }
`;

export const block = {
  name: 'MediaGallery',
  Component: MediaGallery,
  Fragment: FRAGMENT
};
