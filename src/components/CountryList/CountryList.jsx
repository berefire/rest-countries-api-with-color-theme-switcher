import CountryCard from "@/components/CountryCard/CountryCard";

function CountryList({ countries = [] }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 md:gap-18">
      {countries.map((country) => (
        <CountryCard key={country.alpha3Code} country={country} />
      ))}
    </ul>
  );
}

export default CountryList;