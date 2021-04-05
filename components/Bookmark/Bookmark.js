import BookmarkIcon from '@/public/icons/bookmark-regular.svg';
import BookmarkSolidIcon from '@/public/icons/bookmark-solid.svg';
import { useState } from 'react';

export default function Bookmark({ isActive = false, label }) {
  const [isHover, setIsHover] = useState(false);

  return (
    <button
      type="button"
      className="group flex items-center mx-8 md:mx-0"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {isActive || isHover ? (
        <BookmarkSolidIcon className="w-10" />
      ) : (
        <BookmarkIcon className="w-10" />
      )}

      <span className="font-rubik text-xs ml-2">{label}</span>
    </button>
  );
}
