import CountryList from "@/components/CountryList/CountryList";
import SearchFilter from "@/components/SearchFilter/SearchFilter";
import { useCountries } from "@/hooks/useCountries";

function Home() {
  const { countries, setCountries, allCountries } = useCountries();

  return (
    <>
      <SearchFilter allCountries={allCountries} setCountries={setCountries} />
      <div className="flex flex-col justify-content px-14 pbs-6 md:pbs-12 pbe-16.25 md:pbe-14.5  md:px-21">
        <CountryList countries={countries} />
      </div>
    </>
  );
}

export default Home;
