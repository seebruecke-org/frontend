import Image from '@/components/Image';

export default function Media({ media }) {
  return (
    <Image
      image={media}
      className="col-span-full md:col-start-2 md:col-span-10 my-20 grid grid-cols-10 md:place-items-end"
      classNameImage="col-span-full md:col-start-1 md:col-span-8"
      classNameCaption="col-span-full md:col-start-9 md:col-span-2 md:pb-0"
    />
  );
}
