import clsx from 'clsx';

import StrapiLink from '@/components/StrapiLink';

export default function Breadcrumbs({ crumbs }) {
  if (!crumbs) {
    return null;
  }

  return (
    <ul className="col-start-3 col-span-10 flex py-5 px-8">
      {crumbs.map((crumb, index) => {
        const isFirst = index === 0;
        const isLast = index + 1 === crumbs.length;

        return (
          <li
            key={`breadcrumb-${index}`}
            className={clsx(isLast && 'hidden md:inline-flex')}
          >
            {!isFirst && (
              <span className="font-rubik text-gray-400 mx-2 uppercase text-2xs md:text-xs hidden md:inline-flex">
                &gt;
              </span>
            )}
            <StrapiLink
              link={crumb}
              className={clsx(
                'font-rubik text-gray-600 uppercase text-2xs md:text-xs',
                crumb.url && 'hover:underline'
              )}
            />
          </li>
        );
      })}
    </ul>
  );
}
