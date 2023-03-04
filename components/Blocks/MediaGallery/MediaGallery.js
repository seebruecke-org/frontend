import Gallery from '@/components/Gallery';

export default function MediaGallery({ csbmg_items, blockContext: { index } }) {
  let items = csbmg_items;
  if (!items) {
    return null;
  }

  return (
    <div className="grid grid-layout-primary col-span-full my-10 md:my-20">
      <Gallery items={items} priority={index < 3} />
    </div>
  );
}
