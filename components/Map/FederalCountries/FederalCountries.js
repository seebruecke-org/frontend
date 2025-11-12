import Cities from "../Cities";
import FederalCountry from "../FederalCountry";

export default function FederalCountries({ countries, ...props }) {
    countries.sort((a, b) => a.name.localeCompare(b.name));

    // If every federal-country contains exactly one city, render a flat city list
    if (countries.every(fc => Object.values(fc.cities || {}).length === 1)) {
        const allCities = countries.map(fc => fc.cities[0]);
        return <Cities cities={allCities} />;
    }

    return (
        <ul className="flex flex-col space-y-10">
            {countries.map(({name, uri, cities}) => {
                const count = props.singularKicker && props.pluralKicker ? cities.length : undefined;
                
                return (
                    <li key={`federalCountry-${name}`}>
                        <FederalCountry name={name} uri={uri} count={count} {...props} />
                        <Cities cities={cities} />
                    </li>
                );
            })}
        </ul>
    );
};