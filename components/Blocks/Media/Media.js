import Media from '@/components/Media';

export default function MediaBlock({ image }) {
  return (
    <Media
      image={image}
      className="col-span-full md:col-start-2 md:col-span-10 my-20 grid grid-cols-10 md:place-items-end"
      classNameImage="col-span-full md:col-start-1 md:col-span-8"
      classNameCaption="col-span-full md:col-start-9 md:col-span-2 md:pb-0"
      showCaption={true}
    />
  );
}
