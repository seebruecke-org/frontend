import Group from '@/components/Teaser/Group';

/*
  Component to render a list of cities.
  Props:
  - cities: An array of city objects, each containing a name and a uri.
    Example:
    [
      { name: "Munich", uri: "http://..." },
      { name: "Nuremberg", uri: "http://..." }
    ]
*/
export default function Cities({ cities }) {
  cities.sort(({ name: cityAName }, { name: cityBName }) =>
    cityAName.localeCompare(cityBName)
  );

  return (
    <ul className="grid md:grid-cols-2 gap-8 px-6">
      {cities.map((city) => (
        <li key={`city-${city.name}`}>
          <Group uri={city.uri} name={city.name} />
        </li>
      ))}
    </ul>
  );
}