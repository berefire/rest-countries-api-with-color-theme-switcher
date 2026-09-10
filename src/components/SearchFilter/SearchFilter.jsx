import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

function SearchFilter({ allCountries, setCountries }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [region, setRegion] = useState("");

  function applyFilters(nextSearchTerm, nextRegion) {
    const filtered = allCountries.filter((country) => {
      const matchesSearch = country.name
        .toLowerCase()
        .includes(nextSearchTerm.toLowerCase());
      const matchesRegion = nextRegion === "" || country.region === nextRegion;
      return matchesSearch && matchesRegion;
    });

    setCountries(filtered);
  }

  function handleSearchChange(e) {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(value, region);
  }

  function handleRegionChange(e) {
    const value = e.target.value;
    setRegion(value);
    applyFilters(searchTerm, value);
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10  md:gap-2 px-4 md:px-12 pbs-6 md:pbs-12 lg:px-20">
      <div className="relative w-full lg:max-w-120">
        <IoSearchOutline
          aria-hidden="true"
          className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400"
        />
        <label htmlFor="country-search" className="sr-only">
          Search for a country
        </label>
        <input
          id="country-search"
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for a country..."
          className="w-full pl-12 pr-4 py-3 rounded-sm shadow-md bg-white dark:bg-blue-900 dark:text-white dark:placeholder-gray-300 focus-ring"
        />
      </div>

      <div className="max-w-50 md:w-auto">
        <label htmlFor="region-filter" className="sr-only">
          Filter by region
        </label>
        <select
          id="region-filter"
          value={region}
          onChange={handleRegionChange}
          className="w-full md:w-56 px-6 py-3 rounded-sm shadow-md bg-white dark:bg-blue-900 dark:text-white focus-ring"
        >
          <option value="">Filter by Region</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>
      </div>
    </div>
  );
}

export default SearchFilter;