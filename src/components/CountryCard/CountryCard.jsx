import { Link } from "react-router-dom";

function CountryCard({ country }) {
  const { name, population, region, capital, flags, alpha3Code } = country;

  return (
    <li className="list-none">
    <Link
      to={`/country/${alpha3Code}`}
      className="flex flex-col gap-5.5 bg-white dark:bg-blue-900 rounded-md shadow-md overflow-hidden font-body text-grey-950 dark:text-white transition-transform duration-200 hover:scale-105 hover:shadow-lg"
    >
      <img src={flags.svg} alt={`Flag of ${name}`} loading="lazy" className="w-full h-40 object-cover" />
      <div className="px-6 pbe-12">
        <h2 className="font-extrabold text-lg leading-[1.45] mb-4">{name}</h2>
        <p className="text-sm leading-0.1"><span className="font-semibold text-sm">Population:</span> {population.toLocaleString("en-US")}</p>
        <p className="text-sm leading-0.1"><span className="font-semibold text-sm">Region:</span> {region}</p>
        <p className="text-sm leading-0.1"><span className="font-semibold text-sm">Capital:</span> {capital ?? "N/A"}</p>
      </div>
    </Link>
    </li>
  );
}

export default CountryCard;