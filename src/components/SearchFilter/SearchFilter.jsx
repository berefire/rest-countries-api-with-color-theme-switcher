// src/components/SearchFilter/SearchFilter.jsx
import { useEffect, useRef, useState } from "react";
import { IoSearchOutline, IoChevronDownOutline } from "react-icons/io5";

const REGIONS = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

function SearchFilter({ searchTerm, setSearchTerm, region, setRegion }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);

  function handleSearchChange(e) {
    setSearchTerm(e.target.value);
  }

  function selectRegion(value) {
    setRegion(value);
    setIsOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleTriggerKeyDown(e) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(0);
        } else {
          setActiveIndex((prev) => (prev + 1) % REGIONS.length);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(REGIONS.length - 1);
        } else {
          setActiveIndex(
            (prev) => (prev - 1 + REGIONS.length) % REGIONS.length,
          );
        }
        break;
      case "Home":
      case "End":
        e.preventDefault();
        setIsOpen(true);
        setActiveIndex(e.key === "Home" ? 0 : REGIONS.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen && activeIndex >= 0) {
          selectRegion(REGIONS[activeIndex]);
        } else {
          setIsOpen((prev) => !prev);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      default: {
        if (e.key.length !== 1 || e.ctrlKey || e.metaKey) break;
        const letter = e.key.toLowerCase();
        const next = REGIONS.map(
          (_, i) => (activeIndex + 1 + i) % REGIONS.length,
        ).find((i) => REGIONS[i].toLowerCase().startsWith(letter));
        if (next !== undefined) {
          setIsOpen(true);
          setActiveIndex(next);
        }
        break;
      }
    }
  }
  
  const activeOptionId =
  isOpen && activeIndex >= 0 ? `region-option-${REGIONS[activeIndex]}` : undefined;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10 md:gap-2 px-4 md:px-10.25 pt-6 md:pt-12 lg:px-20.25">
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

      <div
        ref={containerRef}
        className="relative w-full md:w-fit md:min-w-50"
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsOpen(false);
          }
        }}
      >
        <button
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls="region-filter-listbox"
          aria-activedescendant={activeOptionId}
          aria-label={`Filter by region: ${region || "All"}`}
          onClick={() => setIsOpen((prev) => !prev)}
          onKeyDown={handleTriggerKeyDown}
          className="w-full flex items-center justify-between gap-4 px-6 py-3 rounded-sm shadow-md bg-white dark:bg-blue-900 dark:text-white focus-ring"
        >
          <span className="whitespace-nowrap font-body text-[0.75rem] md:text-sm text-grey-950 dark:text-white font-normal leading-[0.2] md:leading-[1.45] lg:leading[0.2]">
            {region || "Filter by Region"}
          </span>
          <IoChevronDownOutline
            aria-hidden="true"
            className={`size-5 text-gray-400 cursor-pointer transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <ul
            id="region-filter-listbox"
            role="listbox"
            aria-label="Filter by region"
            className="absolute z-10 mt-2 w-full rounded-sm shadow-md bg-white dark:bg-blue-900 py-2"
          >
            {REGIONS.map((value, index) => (
              <li
                key={value}
                id={`region-option-${value}`}
                role="option"
                aria-selected={region === value}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectRegion(value)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`px-6 py-2 cursor-pointer font-body text-[0.75rem] md:text-sm leading-[0.16] md:leading-[1.45] text-grey-950 dark:text-white font-normal ${
                  index === activeIndex ? "bg-gray-100 dark:bg-blue-800" : ""
                }`}
              >
                {value}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SearchFilter;
