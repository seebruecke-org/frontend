import { scaleImageTo } from '@/lib/media';
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

async function sideloadData({
  image: {
    media: { width, height, ...media },
    ...image
  }
}) {
  const [scaledWidth, scaledHeight] = scaleImageTo(800, [width, height]);

  return {
    image: {
      ...image,
      media: {
        ...media,
        width: scaledWidth,
        height: scaledHeight
      }
    }
  };
}

export const block = {
  name: 'Media',
  Fragment: FRAGMENT,
  sideload: sideloadData
};
