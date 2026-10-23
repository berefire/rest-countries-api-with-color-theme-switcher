import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useCountries } from "./useCountries";

const mockCountries = vi.hoisted(() => [
  { name: "France", region: "Europe" },
  { name: "Germany", region: "Europe" },
  { name: "Ghana", region: "Africa" },
  { name: "Grenada", region: "Americas" },
]);

vi.mock("@/data/data.json", () => ({
  default: mockCountries,
}));

function renderWithRouter(initialEntry = "/") {
  return renderHook(() => useCountries(), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={[initialEntry]}>{children}</MemoryRouter>
    ),
  });
}

describe("useCountries", () => {
  it("returns every country when no filter is applied", () => {
    const { result } = renderWithRouter("/");
    expect(result.current.countries).toHaveLength(4);
    expect(result.current.searchTerm).toBe("");
    expect(result.current.region).toBe("");
  });

  it("reads the initial search term and region from the URL", () => {
    const { result } = renderWithRouter("/?q=fra&region=Europe");
    expect(result.current.searchTerm).toBe("fra");
    expect(result.current.region).toBe("Europe");
    expect(result.current.countries.map((c) => c.name)).toEqual(["France"]);
  });

  it("filters by name case-insensitively", () => {
    const { result } = renderWithRouter("/?q=FRA");
    expect(result.current.countries.map((c) => c.name)).toEqual(["France"]);
  });

  it("filters by region", () => {
    const { result } = renderWithRouter("/?region=Europe");
    expect(result.current.countries.map((c) => c.name).sort()).toEqual(["France", "Germany"]);
  });

  it("combines search term and region filters", () => {
    const { result } = renderWithRouter("/?q=g&region=Europe");
    expect(result.current.countries.map((c) => c.name)).toEqual(["Germany"]);
  });

  it("returns no countries when the region param doesn't match a known region", () => {
    // e.g. a hand-edited URL with a typo or stale value
    const { result } = renderWithRouter("/?region=Atlantis");
    expect(result.current.countries).toEqual([]);
  });

  it("always exposes the full unfiltered list as allCountries", () => {
    const { result } = renderWithRouter("/?q=fra&region=Europe");
    expect(result.current.allCountries).toEqual(mockCountries);
  });

  it("setSearchTerm updates the filter and removes the param when cleared", () => {
    const { result } = renderWithRouter("/");

    act(() => result.current.setSearchTerm("fra"));
    expect(result.current.searchTerm).toBe("fra");
    expect(result.current.countries.map((c) => c.name)).toEqual(["France"]);

    act(() => result.current.setSearchTerm(""));
    expect(result.current.searchTerm).toBe("");
    expect(result.current.countries).toHaveLength(4);
  });

  it("setRegion updates the filter and removes the param when cleared", () => {
    const { result } = renderWithRouter("/");

    act(() => result.current.setRegion("Africa"));
    expect(result.current.region).toBe("Africa");
    expect(result.current.countries.map((c) => c.name)).toEqual(["Ghana"]);

    act(() => result.current.setRegion(""));
    expect(result.current.region).toBe("");
    expect(result.current.countries).toHaveLength(4);
  });

  it("does not clobber one param when the other is set afterward", () => {
    const { result } = renderWithRouter("/");

    act(() => result.current.setSearchTerm("g"));
    act(() => result.current.setRegion("Europe"));

    expect(result.current.searchTerm).toBe("g");
    expect(result.current.region).toBe("Europe");
    expect(result.current.countries.map((c) => c.name)).toEqual(["Germany"]);
  });
});