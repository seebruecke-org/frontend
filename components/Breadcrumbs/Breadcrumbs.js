import MenuItem from '@/components/MenuItem';

export default function Breadcrumbs({ crumbs }) {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-12 max-w-wide w-full">
        <ul className="col-start-2 col-span-10 flex py-5">
          {crumbs.map((crumb, index) => (
            <li key={`breadcrumb-${index}`}>
              {index !== 0 && (
                <span className="font-rubik text-gray-500 mx-2 uppercase text-2xs md:text-xs">
                  &gt;
                </span>
              )}
              <MenuItem
                {...crumb}
                className="font-rubik text-gray-600 uppercase text-2xs md:text-xs hover:underline"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
