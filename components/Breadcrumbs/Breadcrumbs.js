import MenuItem from '@/components/MenuItem';

export default function Breadcrumbs({ crumbs }) {
  if (!crumbs) {
    return null;
  }

  return (
    <ul className="col-start-2 col-span-10 flex py-5">
      {crumbs.map((crumb, index) => (
        <li key={`breadcrumb-${index}`}>
          {index !== 0 && (
            <span className="font-rubik text-gray-400 mx-2 uppercase text-2xs md:text-xs">
              &gt;
            </span>
          )}
          <MenuItem
            {...crumb}
            className={`font-rubik text-gray-600 uppercase text-2xs md:text-xs ${
              crumb.path && 'hover:underline'
            }`}
          />
        </li>
      ))}
    </ul>
  );
}
