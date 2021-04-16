import { memo } from 'react';
import dynamic from 'next/dynamic';

const MapboxMap = dynamic(() => import('@/components/MapboxMap'));
const MemoizedMap = memo(MapboxMap);

export default function Map(props) {
  return (
    <div className="col-span-full md:col-start-1 md:col-span-6 relative">
      <div className="bg-gray-400 h-96 md:h-screen sticky top-0 overflow-hidden">
        <MemoizedMap {...props} />
      </div>
    </div>
  );
}
