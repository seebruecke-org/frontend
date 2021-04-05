import ReactMapboxGl from 'react-mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapboxMap({ factory = {}, className = '', ...props }) {
  const Map = ReactMapboxGl({
    accessToken: process.env.MAPBOX_ACCESS_TOKEN,
    scrollZoom: false,
    attributionControl: false,
    ...factory
  });

  return (
    <Map
      style="mapbox://styles/gustavpursche/cklm62sl630z117nn1lcg83e1"
      className={`h-full ${className}`}
      {...props}
    />
  );
}
