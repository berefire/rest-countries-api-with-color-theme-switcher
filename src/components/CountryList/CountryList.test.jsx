import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CountryList from "./CountryList";

vi.mock("@/components/CountryCard/CountryCard", () => ({
  default: ({ country }) => <li>{country.name}</li>,
}));

const countries = [
  { name: "France", alpha3Code: "FRA" },
  { name: "Germany", alpha3Code: "DEU" },
  { name: "Ghana", alpha3Code: "GHA" },
];

describe("CountryList", () => {
  it("renders the list container", () => {
    render(<CountryList countries={countries} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("renders one card per country, in order", () => {
    render(<CountryList countries={countries} />);

    const items = screen.getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual(["France", "Germany", "Ghana"]);
  });

  it("renders an empty list when countries is an empty array", () => {
    render(<CountryList countries={[]} />);
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("renders an empty list when the countries prop is omitted", () => {
    render(<CountryList />);
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});