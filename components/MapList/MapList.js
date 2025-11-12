import clsx from 'clsx';
import Country from '@/components/Map/Country';
import FederalCountries from '@/components/Map/FederalCountries';

/*
  Component to render a list of countries (from the example structure).
  Props:
  - countries: An array of country objects:
    [
      {
        name: "Germany",
        uri: "...",
        federalCountries: [
          {
            name: "Bavaria",
            cities: [
              { name: "Munich", uri: "..." },
              ...
            ]
          }
        ]
      }
    ]
*/
export default function CityList({ countries = [], renderItem = undefined, ...props }) {
  if (!Array.isArray(countries) || countries.length === 0) return null;

  return (
    <div className="col-span-full md:col-start-7 md:col-span-8 pb-10 md:pb-36">
      <ul>
        {[...countries]
          .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
          .map((country, index) => (
            <li
              key={`country-${country.name}`}
              className={clsx(index > 0 && 'mt-12 md:mt-20')}
            >

              <Country name={country.name} uri={country.uri} />

              {renderItem ? (
                // Wenn eine Renderfunktion übergeben wurde → diese verwenden
                <div>{renderItem(country.federalCountries || [])}</div>
              ) : (
                // Sonst Standardkomponente B rendern
                <FederalCountries
                  countries={country.federalCountries || []}
                  {...props}
                />
              )}

              
            </li>
          ))}
      </ul>
    </div>
  );
}