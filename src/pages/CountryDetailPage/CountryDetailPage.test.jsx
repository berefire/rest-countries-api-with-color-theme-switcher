import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import CountryDetailPage from "./CountryDetailPage";

const mockCountries = vi.hoisted(() => [
  { name: "France", alpha3Code: "FRA", borders: ["DEU"] },
  { name: "Germany", alpha3Code: "DEU", borders: ["FRA"] },
  { name: "Iceland", alpha3Code: "ISL", borders: [] },
]);

vi.mock("@/data/data.json", () => ({
  default: mockCountries,
}));

vi.mock("@/components/CountryDetail/CountryDetail", () => ({
  default: ({ country, borderCountries }) => (
    <div>
      <h1>{country.name}</h1>
      <p>Borders: {borderCountries.length === 0 ? "none" : borderCountries.map((c) => c.name).join(", ")}</p>
    </div>
  ),
}));

function HomeStandIn() {
  const location = useLocation();
  return <div>Home stand-in {location.search}</div>;
}

function renderDetailPage(initialEntries, initialIndex) {
  return render(
    <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
      <Routes>
        <Route path="/" element={<HomeStandIn />} />
        <Route path="/country/:code" element={<CountryDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("CountryDetailPage", () => {
  it("renders the matched country and its resolved border countries", () => {
    renderDetailPage(["/country/FRA"]);
    expect(screen.getByText("France")).toBeInTheDocument();
    expect(screen.getByText("Borders: Germany")).toBeInTheDocument();
  });

  it("shows 'none' for a country with no border countries", () => {
    renderDetailPage(["/country/ISL"]);
    expect(screen.getByText("Iceland")).toBeInTheDocument();
    expect(screen.getByText("Borders: none")).toBeInTheDocument();
  });

  it("shows a not-found message and a Back button for an unknown code", async () => {
    const user = userEvent.setup();
    renderDetailPage(["/country/ZZZ"]);

    expect(screen.getByText("Country not found.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /back/i }));
    expect(screen.getByText(/Home stand-in/)).toBeInTheDocument();
  });

  it("goes to the home page when landed on directly (no prior history)", async () => {
    const user = userEvent.setup();
    renderDetailPage(["/country/FRA"]); // single entry — this is the first page visited

    await user.click(screen.getByRole("button", { name: /back/i }));

    expect(screen.getByText("Home stand-in")).toBeInTheDocument();
  });

  it("goes back in history, preserving prior search state, when arrived at via navigation", async () => {
    const user = userEvent.setup();
    // Two entries: the user was on a filtered Home page, then navigated to the detail page
    renderDetailPage(["/?region=Europe", "/country/FRA"], 1);

    await user.click(screen.getByRole("button", { name: /back/i }));

    expect(screen.getByText("Home stand-in ?region=Europe")).toBeInTheDocument();
  });
});