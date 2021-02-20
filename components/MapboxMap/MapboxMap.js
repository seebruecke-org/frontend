import ReactMapboxGl from 'react-mapbox-gl';

export default function MapboxMap({ factory = {}, ...props }) {
  const Map = ReactMapboxGl({
    accessToken: process.env.MAPBOX_ACCESS_TOKEN,
    ...factory
  });

  return (
    <Map
      style="mapbox://styles/mapbox/streets-v8"
      className="h-full"
      {...props}
    />
  );
}
