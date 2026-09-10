import countriesData from "@/data/data.json";

export function useCountry(code) {
  const country = countriesData.find((c) => c.alpha3Code === code);

  const borderCountries =
    country?.borders
      ?.map((borderCode) => countriesData.find((c) => c.alpha3Code === borderCode))
      .filter(Boolean) ?? [];

  return { country, borderCountries };
}