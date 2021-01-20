import { useRouter } from 'next/router';

import MenuItem from '@/components/MenuItem';

export default function SectionNavigation({ items, className }) {
  const { asPath } = useRouter();

  return (
    <div
      className={`border-t border-gray-400 bg-orange-200 grid grid-layout-primary col-span-full sticky top-0 z-30 ${className}`}
    >
      <nav className="py-8 px-8 md:px-0 col-span-full md:col-start-3 md:col-span-10 flex flex-row space-x-5 flex-nowrap overflow-x-auto w-full">
        {items.map((item, index) => {
          const isActive = asPath === item.path;

          return (
            <MenuItem
              {...item}
              key={`secondary-${item.path}`}
              className={`block py-2 px-3 md:p-3 uppercase font-rubik font-bold text-xs md:text-base leading-none whitespace-nowrap ${
                isActive && 'bg-white'
              } hover:bg-white col-span-2 text-center ${
                index === 0 && 'col-start-2'
              }`}
            />
          );
        })}
      </nav>
    </div>
  );
}
