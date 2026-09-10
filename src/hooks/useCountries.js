import { useState } from "react";
import countriesData from "@/data/data.json";

export function useCountries() {
  const [countries, setCountries] = useState(countriesData);
  return { countries, setCountries, allCountries: countriesData };
}