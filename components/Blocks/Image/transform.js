import { fetchMedia } from '@/lib/media';

export default async function transform(props) {
  if (!props?.attributes?.id) {
    return null;
  }

  const media = await fetchMedia(props.attributes.id);

  // If the block itself has a caption, overwrite the original
  // description
  if (media?.mediaItem && props?.attributes?.caption) {
    media.mediaItem.description = props?.attributes?.caption;
  }

  return {
    ...props,
    ...media
  };
}
