import { useRouter } from 'next/router';

import HStack from '@/components/HStack';
import MenuItem from '@/components/MenuItem';

export default function SectionNavigation({ items }) {
  const { asPath } = useRouter();

  return <div className="border-t border-gray-400 bg-orange-200 flex justify-center">
    <HStack as="nav" gap={5} className="py-8 px-8 md:px-0 w-full max-w-wide grid grid-cols-12">
    {items.map(({ title, uri }, index) => {
      const isActive = `${asPath}/` === uri;

      return <MenuItem label={title} path={uri} key={`secondary-${uri}`} className={`block p-2 md:p-3 uppercase font-rubik font-bold text-xs md:text-base leading-none ${isActive && 'bg-white'} hover:bg-white col-span-2 text-center ${index === 0 && 'col-start-2'}`} />
    })}
  </HStack>
  </div>
}
