import { fetchAPI } from '@/lib/api';

export async function fetchMap(slug) {
  if (!slug) {
    return null;
  }

  const locations = (
    await fetchAPI(`
      query {
      maps(filters:  {
         slug:  {
            eq: "${slug}"
         }
       }) {
        data {
          attributes {
            location {
              Name
              Url
              Coordinates
            }
          }
        }  
    } } `)
  ).maps[0].location;

  return locations;
}

export function convertToMapData(locations) {
  return locations
    .filter((l) => l.Name)
    .map((l) => ({
      type: 'Feature',
      properties: {
        name: l.Name,
        type: 'action',
        uri: l.Url
      },
      geometry: {
        type: 'Point',
        coordinates: l.Coordinates.replaceAll(' ', '')
          .split(',')
          .map((s) => parseFloat(s))
          .reverse()
      }
    }));
}
