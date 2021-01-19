import SectionNavigation from '@/components/SectionNavigation';

export default function SubNavigationBlock({ item, ...props }) {
  return <SectionNavigation items={item} {...props} />;
}
