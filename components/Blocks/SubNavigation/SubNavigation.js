import SectionNavigation from '@/components/SectionNavigation';

export default function SubNavigationBlock({ item, ...props }) {
  return (
    <div className="col-span-full sticky top-0 z-30">
      <SectionNavigation items={item} {...props} />
    </div>
  );
}
