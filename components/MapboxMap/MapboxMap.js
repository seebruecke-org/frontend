import ReactMapboxGl from 'react-mapbox-gl';

export default function MapboxMap({ factory = {}, ...props }) {
  const Map = ReactMapboxGl({
    accessToken: process.env.MAPBOX_ACCESS_TOKEN,
    ...factory
  });

  return (
    <Map
      style="mapbox://styles/gustavpursche/cklm62sl630z117nn1lcg83e1"
      className="h-full"
      {...props}
    />
  );
}
