import FRAGMENT_MEDIA from '@/components/Media/fragment';

async function sideloadData({ csbmg_items }) {
  const { scaleImageTo } = await import('@/lib/media');
  return csbmg_items.map(({ media: { width, height, ...media } }) => {
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
    gallery_layout: layout,
    csbmg_items: items {
      ${FRAGMENT_MEDIA}
    }
  }
`;

export default {
  name: 'MediaGallery',
  Fragment: FRAGMENT,
  sideload: sideloadData
};
