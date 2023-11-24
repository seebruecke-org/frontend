import Gallery from '@/components/Gallery';

export default function MediaGallery({ csbmg_items, gallery_layout, blockContext: { index } }) {
  let items = csbmg_items;
  if (!items) {
    return null;
  }

  return <Gallery items={items} priority={index < 3} layout={gallery_layout} />;
}
