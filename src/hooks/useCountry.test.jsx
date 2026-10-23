import { describe, it, expect, vi } from "vitest";
import { useCountry } from "./useCountry";

const mockCountries = vi.hoisted(() => [
  { name: "France", alpha3Code: "FRA", borders: ["DEU", "ESP"] },
  { name: "Germany", alpha3Code: "DEU", borders: ["FRA"] },
  { name: "Spain", alpha3Code: "ESP", borders: ["FRA", "PRT"] }, // PRT deliberately absent below
  { name: "Australia", alpha3Code: "AUS", borders: [] },
  { name: "Iceland", alpha3Code: "ISL" }, // no borders field at all
]);

vi.mock("@/data/data.json", () => ({
  default: mockCountries,
}));

describe("useCountry", () => {
  it("returns the matching country for a valid code", () => {
    const { country } = useCountry("FRA");
    expect(country).toEqual(mockCountries[0]);
  });

  it("resolves border codes to full country objects", () => {
    const { borderCountries } = useCountry("FRA");
    expect(borderCountries.map((c) => c.name)).toEqual(["Germany", "Spain"]);
  });

  it("filters out border codes that don't match a known country", () => {
    // Spain's data lists FRA and PRT as borders, but PRT isn't in this dataset
    const { borderCountries } = useCountry("ESP");
    expect(borderCountries.map((c) => c.name)).toEqual(["France"]);
  });

  it("returns an empty array when borders is an empty array", () => {
    const { borderCountries } = useCountry("AUS");
    expect(borderCountries).toEqual([]);
  });

  it("returns an empty array when the country has no borders field at all", () => {
    const { borderCountries } = useCountry("ISL");
    expect(borderCountries).toEqual([]);
  });

  it("returns an undefined country and an empty border list for an unknown code", () => {
    const { country, borderCountries } = useCountry("ZZZ");
    expect(country).toBeUndefined();
    expect(borderCountries).toEqual([]);
  });
});