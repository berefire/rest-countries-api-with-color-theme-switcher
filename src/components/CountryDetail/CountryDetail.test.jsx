import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CountryDetail from "./CountryDetail";

const fullCountry = {
  name: "Switzerland",
  nativeName: "Schweiz",
  population: 8654622,
  region: "Europe",
  subregion: "Western Europe",
  capital: "Bern",
  topLevelDomain: [".ch"],
  currencies: [{ name: "Swiss franc" }],
  languages: [{ name: "German" }, { name: "French" }],
  flags: { svg: "https://flagcdn.com/ch.svg" },
};

const borderCountries = [
  { name: "France", alpha3Code: "FRA" },
  { name: "Germany", alpha3Code: "DEU" },
];

function renderDetail(country, borders = []) {
  return render(
    <MemoryRouter>
      <CountryDetail country={country} borderCountries={borders} />
    </MemoryRouter>,
  );
}

describe("CountryDetail", () => {
  it("renders all the core country fields", () => {
    renderDetail(fullCountry);

    expect(
      screen.getByRole("heading", { name: "Switzerland" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Schweiz")).toBeInTheDocument();
    expect(screen.getByText("8,654,622")).toBeInTheDocument();
    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.getByText("Western Europe")).toBeInTheDocument();
    expect(screen.getByText("Bern")).toBeInTheDocument();
    expect(screen.getByText(".ch")).toBeInTheDocument();
    expect(screen.getByText("Swiss franc")).toBeInTheDocument();
    expect(screen.getByText("German, French")).toBeInTheDocument();
  });

  it("renders the flag with the correct src and alt text", () => {
    renderDetail(fullCountry);
    expect(
      screen.getByRole("img", { name: "Flag of Switzerland" }),
    ).toHaveAttribute("src", fullCountry.flags.svg);
  });

  it("renders border country links", () => {
    renderDetail(fullCountry, borderCountries);
    expect(screen.getByRole("link", { name: "France" })).toHaveAttribute(
      "href",
      "/country/FRA",
    );
    expect(screen.getByRole("link", { name: "Germany" })).toHaveAttribute(
      "href",
      "/country/DEU",
    );
  });

  it("does not render the border countries section when there are none", () => {
    renderDetail(fullCountry, []);
    expect(screen.queryByText("Border Countries:")).not.toBeInTheDocument();
  });

  it('shows "N/A" when capital is undefined', () => {
    renderDetail({ ...fullCountry, capital: undefined });
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it('shows "N/A" when currencies is undefined', () => {
    renderDetail({ ...fullCountry, currencies: undefined });
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it('shows "N/A" when languages is undefined', () => {
    renderDetail({ ...fullCountry, languages: undefined });
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it('shows "N/A" when capital is an empty array', () => {
    renderDetail({ ...fullCountry, capital: [] });
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it('shows "N/A" when currencies is an empty array', () => {
    renderDetail({ ...fullCountry, currencies: [] });
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it('shows "N/A" when languages is an empty array', () => {
    renderDetail({ ...fullCountry, languages: [] });
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it('shows "N/A" when topLevelDomain is undefined', () => {
    renderDetail({ ...fullCountry, topLevelDomain: undefined });
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });
});
