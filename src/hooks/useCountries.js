import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import countriesData from "@/data/data.json";

export function useCountries() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") ?? "";
  const region = searchParams.get("region") ?? "";

  const countries = useMemo(() => {
    return countriesData.filter((country) => {
      const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = region === "" || country.region === region;
      return matchesSearch && matchesRegion;
    });
  }, [searchTerm, region]);

  function setSearchTerm(value) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set("q", value);
        else next.delete("q");
        return next;
      },
      { replace: true },
    );
  }

  function setRegion(value) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set("region", value);
        else next.delete("region");
        return next;
      },
      { replace: true },
    );
  }

  return { countries, allCountries: countriesData, searchTerm, setSearchTerm, region, setRegion };
}