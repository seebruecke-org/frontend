import dynamic from 'next/dynamic';

const MapboxMap = dynamic(() => import('@/components/MapboxMap'), {
  ssr: false
});

export default function Map(props) {
  return (
    <div className="col-span-full md:col-start-1 md:col-span-6 relative">
      <div className="bg-gray-400 h-96 md:h-screen sticky top-0 overflow-hidden">
        <MapboxMap {...props} />
      </div>
    </div>
  );
}
