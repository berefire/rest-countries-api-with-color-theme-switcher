import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
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
  const locationRef = { current: undefined };

  function LocationProbe() {
    locationRef.current = useLocation();
    return null;
  }

  const utils = renderHook(() => useCountries(), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={[initialEntry]}>
        <LocationProbe />
        {children}
      </MemoryRouter>
    ),
  });

  return { ...utils, locationRef };
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
    expect(result.current.countries.map((c) => c.name).sort()).toEqual([
      "France",
      "Germany",
    ]);
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

  it("setSearchTerm updates the filter, persists it to the URL, and removes it when cleared", () => {
    const { result, locationRef } = renderWithRouter("/");

    act(() => result.current.setSearchTerm("fra"));
    expect(result.current.searchTerm).toBe("fra");
    expect(result.current.countries.map((c) => c.name)).toEqual(["France"]);
    expect(new URLSearchParams(locationRef.current.search).get("q")).toBe(
      "fra",
    );

    act(() => result.current.setSearchTerm(""));
    expect(result.current.searchTerm).toBe("");
    expect(result.current.countries).toHaveLength(4);
    expect(new URLSearchParams(locationRef.current.search).get("q")).toBeNull();
  });

  it("setRegion updates the filter, persists it to the URL, and removes it when cleared", () => {
    const { result, locationRef } = renderWithRouter("/");

    act(() => result.current.setRegion("Africa"));
    expect(result.current.region).toBe("Africa");
    expect(result.current.countries.map((c) => c.name)).toEqual(["Ghana"]);
    expect(new URLSearchParams(locationRef.current.search).get("region")).toBe(
      "Africa",
    );

    act(() => result.current.setRegion(""));
    expect(result.current.region).toBe("");
    expect(result.current.countries).toHaveLength(4);
    expect(
      new URLSearchParams(locationRef.current.search).get("region"),
    ).toBeNull();
  });

  it("does not clobber one param when the other is set afterward, and persists both to the URL", () => {
    const { result, locationRef } = renderWithRouter("/");

    act(() => result.current.setSearchTerm("g"));
    act(() => result.current.setRegion("Europe"));

    expect(result.current.searchTerm).toBe("g");
    expect(result.current.region).toBe("Europe");
    expect(result.current.countries.map((c) => c.name)).toEqual(["Germany"]);

    const params = new URLSearchParams(locationRef.current.search);
    expect(params.get("q")).toBe("g");
    expect(params.get("region")).toBe("Europe");
  });
});
