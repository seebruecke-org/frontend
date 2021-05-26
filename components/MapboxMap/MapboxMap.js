import ReactMapGL, { WebMercatorViewport, Source, Layer } from 'react-map-gl';
import { featureCollection } from '@turf/helpers';
import { useState } from 'react';
import bbox from '@turf/bbox';

import 'mapbox-gl/dist/mapbox-gl.css';

const getBounds = (features) => {
  const [minX, minY, maxX, maxY] = bbox(featureCollection(features));

  return [
    [minX, minY],
    [maxX, maxY]
  ];
};

const getFitBounds = (features) => {
  const bounds = getBounds(features);
  const viewport = new WebMercatorViewport({
    width: 800,
    height: 600
  }).fitBounds(bounds, { padding: 100 });

  const { longitude, latitude, zoom } = viewport;
  return { longitude, latitude, zoom };
};

export default function MapboxMap({
  features: defaultFeatures = [],
  ...props
}) {
  const hasFeatures = defaultFeatures.length > 0;
  const [collection] = useState({
    type: 'FeatureCollection',
    features: defaultFeatures
  });
  const bounds = getFitBounds(collection.features);

  const [viewport, setViewport] = useState({
    height: '100%',
    width: '100%',
    ...bounds,
    ...props
  });

  const dataLayer = {
    id: 'data',
    type: 'circle',
    paint: {
      'circle-radius': 8,
      'circle-color': [
        'match',
        ['get', 'type'],
        'action',
        'rgb(69, 238, 191)',
        'rgb(245, 181, 17)'
      ]
    }
  };

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      mapStyle="mapbox://styles/gustavpursche/cklm62sl630z117nn1lcg83e1"
      onViewportChange={setViewport}
    >
      {hasFeatures && (
        <Source type="geojson" data={collection}>
          <Layer {...dataLayer} />
        </Source>
      )}
    </ReactMapGL>
  );
}
