import ReactMapboxGl, { GeoJSONLayer } from 'react-mapbox-gl';
import { featureCollection } from '@turf/helpers';
import { useState } from 'react';
import bbox from '@turf/bbox';
import clsx from 'clsx';

import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapboxMap({
  factory = {},
  className = '',
  features: defaultFeatures = [],
  ...props
}) {
  const Map = ReactMapboxGl({
    accessToken: process.env.NEXT_MAPBOX_ACCESS_TOKEN,
    attributionControl: false,
    ...factory
  });

  const hasFeatures = defaultFeatures.length > 0;
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
    <Map
      style="mapbox://styles/gustavpursche/cklm62sl630z117nn1lcg83e1"
      className={clsx('h-full', className)}
      fitBounds={hasFeatures && getBounds(collection.features)}
      fitBoundsOptions={
        collection && {
          duration: 0,
          padding: 100
        }
      }
      {...props}
    >
      {hasFeatures && (
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
    </Map>
  );
}
