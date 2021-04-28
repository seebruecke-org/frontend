import { scaleImageTo } from '@/lib/media';
import MediaGallery from './MediaGallery';
import { FRAGMENT as FRAGMENT_MEDIA } from '@/components/Media';

export default MediaGallery;

async function sideloadData({ items }) {
  return items.map(({ media: { width, height, ...media } }) => {
    const [scaledWidth, scaledHeight] = scaleImageTo(600, [width, height]);

    return {
      media: {
        ...media,
        width: scaledWidth,
        height: scaledHeight
      }
    };
  });
}

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
  Fragment: FRAGMENT,
  sideload: sideloadData
};
