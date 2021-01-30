import Image from '@/components/Image';

export default function MediaBlock({ media, description }) {
  if (description) {
    media[0].caption = description;
  }

  return (
    <Image
      image={media[0]}
      className="col-span-full md:col-start-2 md:col-span-10 my-20 grid grid-cols-10 md:place-items-end"
      classNameImage="col-span-full md:col-start-1 md:col-span-8"
      classNameCaption="col-span-full md:col-start-9 md:col-span-2 md:pb-0"
    />
  );
}
