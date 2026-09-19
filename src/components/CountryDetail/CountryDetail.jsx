import { Link } from "react-router-dom";

function CountryDetail({ country, borderCountries }) {
  const {
    name,
    nativeName,
    population,
    region,
    subregion,
    capital,
    topLevelDomain,
    currencies,
    languages,
    flags,
  } = country;

  return (
    <article className="flex flex-col gap-16 md:gap-14 lg:gap-20 max-w-[20rem] md:max-w-142.5 lg:max-w-319.5 font-body text-blue-950 dark:text-white ">
      <div className="grid lg:grid-cols-[auto_1fr] gap-12 md:gap-14 lg:gap-30 items-center">
        <img
          src={flags.svg}
          alt={`Flag of ${name}`}
          className="w-full lg:max-w-140 rounded-lg"
        />

        <div className="flex flex-col gap-4 md:gap-6 font-light text-sm md:text-[1rem] leading-loose">
          <h2 className="text-2xl md:text-[2rem] font-extrabold leading-snug">
            {name}
          </h2>

          <div className="flex flex-col gap-8 md:gap-6 lg:gap-16">
            <div className="flex flex-col md:flex-row gap-8 md:justify-between">
              <div>
                <p>
                  <span className="font-semibold">Native Name:</span>{" "}
                  {nativeName}
                </p>
                <p>
                  <span className="font-semibold">Population:</span>{" "}
                  {population.toLocaleString("en-US")}
                </p>
                <p>
                  <span className="font-semibold">Region:</span> {region}
                </p>
                <p>
                  <span className="font-semibold">Sub Region:</span> {subregion}
                </p>
                <p>
                  <span className="font-semibold">Capital:</span>{" "}
                  {capital ?? "N/A"}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Top Level Domain:</span>{" "}
                  {topLevelDomain?.join(", ")}
                </p>
                <p>
                  <span className="font-semibold">Currencies:</span>{" "}
                  {currencies?.map((c) => c.name).join(", ") ?? "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Languages:</span>{" "}
                  {languages?.map((l) => l.name).join(", ") ?? "N/A"}
                </p>
              </div>
            </div>

            {borderCountries.length > 0 && (
              <div className="flex flex-wrap items-center gap-4">
                <span id="border-countries-label" className="font-semibold">Border Countries:</span>
                <ul aria-labelledby="border-countries-label" className="flex flex-wrap gap-4 list-none p-0 m-0">
                {borderCountries.map((border) => (
                  <li key={border.alpha3Code}>
                  <Link
                    key={border.alpha3Code}
                    to={`/country/${border.alpha3Code}`}
                    className="px-7.5 py-1.5 shadow-sm bg-white dark:bg-blue-900 dark:text-white text-xs md:text-sm leading-snug md:leading-[2.25] rounded-xs"
                  >
                    {border.name}
                  </Link>
                </li>
                ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default CountryDetail;
