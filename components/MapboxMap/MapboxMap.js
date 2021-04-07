import clsx from 'clsx';
import ReactMapboxGl from 'react-mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

const Map = ReactMapboxGl({
  accessToken: process.env.MAPBOX_ACCESS_TOKEN,
  attributionControl: false
});

export default function MapboxMap({ className = '', ...props }) {
  return (
    <Map
      style="mapbox://styles/gustavpursche/cklm62sl630z117nn1lcg83e1"
      className={clsx('h-full', className)}
      {...props}
    />
  );
}
