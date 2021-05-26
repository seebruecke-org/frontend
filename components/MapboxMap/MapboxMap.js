import ReactMapGL, { WebMercatorViewport, Marker } from 'react-map-gl';
import { featureCollection } from '@turf/helpers';
import { useState, useMemo } from 'react';
import bbox from '@turf/bbox';

import ActionMarker from '@/components/MapboxMap/Marker/Action';
import CityMarker from '@/components/MapboxMap/Marker/City';

import 'mapbox-gl/dist/mapbox-gl.css';

const MARKER_TYPE_MAP = {
  action: ActionMarker,
  city: CityMarker
};

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

export default function MapboxMap({ features = [], ...props }) {
  const bounds = useMemo(() => getFitBounds(features), [features]);
  const markers = useMemo(
    () =>
      features.map(
        ({
          geometry: { coordinates },
          properties: { id, name, type, uri }
        }) => {
          const Component = MARKER_TYPE_MAP[type];
          const [longitude, latitude] = coordinates;

          return (
            <Marker
              key={`marker-${id}`}
              longitude={longitude}
              latitude={latitude}
            >
              <Component label={name} uri={uri} />
            </Marker>
          );
        }
      ),
    [features]
  );

  const [viewport, setViewport] = useState({
    height: '100%',
    width: '100%',
    scrollZoom: { smooth: true },
    ...bounds,
    ...props
  });

  return (
    <ReactMapGL
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      mapStyle="mapbox://styles/gustavpursche/cklm62sl630z117nn1lcg83e1"
      onViewportChange={setViewport}
      {...viewport}
    >
      {markers}
    </ReactMapGL>
  );
}
