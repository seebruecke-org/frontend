import { Layer, Feature } from 'react-mapbox-gl';
import dynamic from 'next/dynamic';

const MapboxMap = dynamic(() => import('@/components/MapboxMap'));

export default function Map({ marker }) {
  return (
    <div className="col-span-full md:col-start-1 md:col-span-6 relative">
      <div className="bg-gray-400 h-96 md:h-screen sticky top-0 overflow-hidden">
        <MapboxMap>
          <Layer
            id="points"
            type="circle"
            paint={{ 'circle-color': 'red', 'circle-radius': 5 }}
          >
            {marker.map(({ title, coordinates }, index) => {
              const mbCoordinates = coordinates
                .split(',')
                .reverse()
                .map((part) => parseFloat(part.trim(), 10));

              console.log(mbCoordinates);

              return (
                <Feature coordinates={mbCoordinates} key={`marker-${index}`} />
              );
            })}
          </Layer>
        </MapboxMap>
      </div>
    </div>
  );
}
