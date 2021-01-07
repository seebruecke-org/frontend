import HStack from '@/components/HStack';
import MenuItem from '@/components/MenuItem';

export default function SectionNavigation({ items }) {
  return <HStack as="nav" gap={5}>
    {items.map(({ title, slug }) => <MenuItem label={title} path={slug} className="block p-3 uppercase font-rubik font-bold text-base bg-white leading-none" />)}
  </HStack>
}
