import { useState, useEffect } from 'react';

function filterCities(cities, term) {
  return Object.keys(cities).reduce((acc, countryName) => {
    const federalCountries = cities[countryName].countries;
    const matchingFederalCountries = {};

    Object.keys(federalCountries).forEach((federalCountryName) => {
      const federalCountry = federalCountries[federalCountryName];

      federalCountry.cities.forEach((city) => {
        const { name: cityName } = city;

        if (cityName === term || cityName.includes(term)) {
          const federalCountryExists =
            matchingFederalCountries[federalCountryName];

          if (!federalCountryExists) {
            matchingFederalCountries[federalCountryName] = { cities: [] };
          }

          matchingFederalCountries[federalCountryName].cities.push(city);
        }
      });
    });

    if (Object.keys(matchingFederalCountries).length > 0) {
      acc[countryName] = {
        countries: matchingFederalCountries
      };
    }

    return acc;
  }, {});
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
