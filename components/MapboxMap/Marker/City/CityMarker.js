import { useState } from 'react';
import clsx from 'clsx';

export default function CityMarker({ name }) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      className={clsx(
        'w-8 h-auto opacity-60',
        isActive ? 'text-orange-800 cursor-pointer' : 'text-orange-200'
      )}
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-label={name}
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
      >
        <circle cx="50" cy="50" r="50" fill="currentColor" />
      </svg>
    </div>
  );
}
