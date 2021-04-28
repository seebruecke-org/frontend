import Gallery from '@/components/Gallery';

export default function MediaGallery({ items, blockContext: { index } }) {
  if (!items) {
    return null;
  }

  return (
    <div className="grid grid-layout-primary col-span-full my-10 md:my-20">
      <Gallery items={items} priority={index < 3} />
    </div>
  );
}
