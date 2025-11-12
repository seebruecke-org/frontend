import { fetchAPI } from '@/lib/api';

export async function fetchMap(slug) {
  if (!slug) {
    return null;
  }

  const locations = await fetchAPI(`
      query {
      maps(filters:  {
         slug:  {
            eq: "${slug}"
         }
       }) {
        data{attributes {
          location {
            Name
            Url
            Coordinates
            federal_country {data{attributes{
              slug
              name

              country {data{attributes{
                name
              }}}
            }}}
          }
        }}
      }  
    }`);

  return locations.maps[0]?.location || [];
}

export function convertToMapData(locations) {
  return locations
    .filter((l) => l.Name)
    .map((l) => ({
      type: 'Feature',
      properties: {
        name: l.Name,
        type: 'action',
        uri: l.Url,
        federal_country: l.federal_country
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
