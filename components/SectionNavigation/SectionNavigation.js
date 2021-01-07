import HStack from '@/components/HStack';
import MenuItem from '@/components/MenuItem';

export default function SectionNavigation({ items }) {
  return <div className="border-t border-gray-400 flex justify-center">
    <HStack as="nav" gap={5} className="py-8 px-8 w-full max-w-regular">
    {items.map(({ title, slug }) => <MenuItem label={title} path={slug} className="block p-2 md:p-3 uppercase font-rubik font-bold text-xs md:text-base bg-white leading-none" />)}
  </HStack>
  </div>
}
