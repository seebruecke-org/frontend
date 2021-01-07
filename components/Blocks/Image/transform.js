import { fetchMedia } from '@/lib/media';

export default async function transform(props) {
  if (!props?.attributes?.id) {
    return null;
  }

  const media = await fetchMedia(props.attributes.id);

  return {
    ...props,
    ...media
  };
}
