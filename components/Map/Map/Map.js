import { GeoJSONLayer } from 'react-mapbox-gl';
import { featureCollection } from '@turf/helpers';
import { useState } from 'react';
import { memo } from 'react';
import bbox from '@turf/bbox';
import dynamic from 'next/dynamic';

const MapboxMap = dynamic(() => import('@/components/MapboxMap'));
const MemoizedMap = memo(MapboxMap);

export default function Map({ features: defaultFeatures }) {
  const [collection, setCollection] = useState({
    type: 'FeatureCollection',
    features: defaultFeatures
  });

  const getBounds = (features) => {
    const [minX, minY, maxX, maxY] = bbox(featureCollection(features));

    return [
      [minX, minY],
      [maxX, maxY]
    ];
  };

  return (
    <div className="col-span-full md:col-start-1 md:col-span-6 relative">
      <div className="bg-gray-400 h-96 md:h-screen sticky top-0 overflow-hidden">
        <MemoizedMap
          fitBounds={collection?.features && getBounds(collection.features)}
          fitBoundsOptions={
            collection && {
              duration: 0,
              padding: 20
            }
          }
        >
          {collection?.features && (
            <GeoJSONLayer
              data={collection}
              circlePaint={{
                'circle-color': [
                  'match',
                  ['get', 'type'],
                  'action',
                  'rgb(69, 238, 191)',
                  'rgb(245, 181, 17)'
                ],
                'circle-radius': 8
              }}
            />
          )}
        </MemoizedMap>
      </div>
    </div>
  );
}
