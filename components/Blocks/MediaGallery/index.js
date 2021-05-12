import MediaGallery from './MediaGallery';
import { FRAGMENT as FRAGMENT_MEDIA } from '@/components/Media';

export default MediaGallery;

async function sideloadData({ items }) {
  const { scaleImageTo } = await import('@/lib/media');

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
  Fragment: FRAGMENT,
  sideload: sideloadData
};
