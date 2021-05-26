import Marker from '@/components/MapboxMap/Marker/Marker';

export default function CityMarker({ name, uri }) {
  return (
    <Marker
      uri={uri}
      className="hover:text-black text-turquoise-300 opacity-80 hover:opacity-100"
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-label={name}
      >
        <circle cx="50" cy="50" r="50" fill="currentColor" />
      </svg>
    </Marker>
  );
}
