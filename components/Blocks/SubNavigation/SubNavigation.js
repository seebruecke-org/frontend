import SectionNavigation from '@/components/SectionNavigation';

export default function SubNavigationBlock(props) {
  return (
    <div className="col-span-full sticky top-0 z-30">
      <SectionNavigation {...props} />
    </div>
  );
}
