import MEDIA_FRAGMENT from '@/components/Media/fragment';

export const FRAGMENT = `
  ... on ComponentSharedBlocksMedia {
    image {
      ${MEDIA_FRAGMENT}
    }
  }
`;

async function sideloadData({ image }) {
  if (!image?.media) {
    return image;
  }

  const {
    media: { width, height, ...media },
    ...imageProps
  } = image;
  const { scaleImageTo } = await import('@/lib/media');
  const [scaledWidth, scaledHeight] = scaleImageTo(800, [width, height]);

  return {
    image: {
      ...imageProps,
      media: {
        ...media,
        width: scaledWidth,
        height: scaledHeight
      }
    }
  };
}

export default {
  name: 'Media',
  Fragment: FRAGMENT,
  sideload: sideloadData
};
