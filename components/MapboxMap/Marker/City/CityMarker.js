import Marker from '@/components/MapboxMap/Marker/Marker';

export default function CityMarker({ name, uri }) {
  return (
    <Marker
      uri={uri}
      className="text-orange-200 opacity-60 hover:text-orange-800 hover:opacity-100 cursor-pointer"
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
