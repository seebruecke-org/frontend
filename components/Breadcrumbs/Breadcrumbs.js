import MenuItem from '@/components/MenuItem';

export default function Breadcrumbs({ crumbs }) {
  return <div className="flex justify-center">
    <div className="max-w-regular w-full">
      <ul className="flex py-5">
        {crumbs.map((crumb, index) => (
          <li>
            {index !== 0 && (
              <span className="font-rubik text-gray-500 mx-2 uppercase text-xs">&gt;</span>
            )}
            <MenuItem {...crumb} className="font-rubik text-gray-500 uppercase text-xs hover:underline" />
          </li>
        ))}
      </ul>
    </div>
  </div>
}
