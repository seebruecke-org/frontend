import { point } from '@turf/helpers';

export function toMapboxCoordinates(coordinates) {
  if (!coordinates) {
    return null;
  }

  const [lat, lng] = coordinates.split(',') || [null, null];

  return lat && lng && point([parseFloat(lng), parseFloat(lat)]);
}
