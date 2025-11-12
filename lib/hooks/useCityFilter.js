import { useState, useEffect } from 'react';

/*
  example cities structure:
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
function filterCities(cities, term) {
  return cities.reduce((acc, country) => {
    const matchingFederalCountries = [];

    country.federalCountries.forEach((federalCountry) => {
      const matchingCities = federalCountry.cities.filter((city) => {
        const normalizedCityName = city.name.toLowerCase();
        const normalizedTerm = term.toLowerCase();

        return (
          normalizedCityName === normalizedTerm ||
          normalizedCityName.includes(normalizedTerm)
        );
      });

      if (matchingCities.length > 0) {
        matchingFederalCountries.push({
          ...federalCountry,
          cities: matchingCities
        });
      }
    });

    if (matchingFederalCountries.length > 0) {
      acc.push({
        ...country,
        federalCountries: matchingFederalCountries
      });
    }

    return acc;
  }, []);
}

export default function useCityFilter(defaultCities) {
  const [filter, setFilter] = useState(null);
  const [cities, setCities] = useState(defaultCities);

  useEffect(() => {
    if (filter) {
      setCities(filterCities(defaultCities, filter));
    } else {
      setCities(defaultCities);
    }
  }, [filter]);

  return {
    cities,
    filter,
    setFilter
  };
}
