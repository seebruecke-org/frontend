import { useRouter } from 'next/router';

import MenuItem from '@/components/MenuItem';

import * as styles from './sectionNavigation.module.css';

export default function SectionNavigation({ items, className }) {
  const { asPath } = useRouter();

  return (
    <div
      className={`bg-orange-200 grid grid-layout-primary col-span-full sticky top-0 z-30 mb-10 ${styles.navigation} ${className}`}
    >
      <span
        className={`w-full bg-gray-400 absolute top-0 left-0 ${styles.border}`}
      />

      <nav className="py-8 px-8 md:px-0 col-span-full md:col-start-3 md:col-span-10 flex flex-row space-x-5 flex-nowrap overflow-x-auto w-full">
        {items.map((item, index) => {
          const isActive = asPath === item.path;

          return (
            <MenuItem
              {...item}
              key={`secondary-${item.path}`}
              className={`block py-2 px-3 md:p-3 uppercase font-rubik font-rubik-features font-bold text-xs md:text-base leading-none whitespace-nowrap ${
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
