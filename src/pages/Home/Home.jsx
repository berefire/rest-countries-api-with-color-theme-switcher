import CountryList from "@/components/CountryList/CountryList";
import SearchFilter from "@/components/SearchFilter/SearchFilter";
import { useCountries } from "@/hooks/useCountries";

function buildEmptyMessage(searchTerm, region) {
  if (searchTerm && region)
    return `No countries match "${searchTerm}" in ${region}.`;
  if (searchTerm) return `No countries match "${searchTerm}".`;
  if (region) return `No countries found in ${region}.`;
  return "No countries found.";
}

function Home() {
  const {
    countries,
    searchTerm,
    setSearchTerm,
    region,
    setRegion,
  } = useCountries();

  return (
    <>
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        region={region}
        setRegion={setRegion}
      />
      <p role="status" className="px-4 md:px-10.25 lg:px-20.25 pt-4">
        {countries.length === 0 ? buildEmptyMessage(searchTerm, region) : ""}
      </p>
      <div className="flex flex-col justify-content px-14 pbs-6 md:pbs-12 pbe-16.25 md:pbe-14.5  md:px-21">
        <CountryList countries={countries} />
      </div>
    </>
  );
}

export default Home;
