import Image from '@/components/Image';

export default function MediaBlock({ media, description }) {
  if (description) {
    media[0].caption = description;
  }

  return (
    <Image
      image={media[0]}
      className="col-span-full md:col-start-2 md:col-span-8 my-20"
    />
  );
}
