import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeProvider";
import App from "./App";

const mockCountries = vi.hoisted(() => [
  {
    name: "France", nativeName: "France", population: 67000000, region: "Europe", subregion: "Western Europe",
    capital: "Paris", topLevelDomain: [".fr"], currencies: [{ name: "Euro" }], languages: [{ name: "French" }],
    flags: { svg: "https://flagcdn.com/fr.svg" }, alpha3Code: "FRA", borders: ["DEU"],
  },
  {
    name: "Germany", nativeName: "Deutschland", population: 83000000, region: "Europe", subregion: "Western Europe",
    capital: "Berlin", topLevelDomain: [".de"], currencies: [{ name: "Euro" }], languages: [{ name: "German" }],
    flags: { svg: "https://flagcdn.com/de.svg" }, alpha3Code: "DEU", borders: ["FRA"],
  },
  {
    name: "Iceland", nativeName: "Ísland", population: 366000, region: "Europe", subregion: "Northern Europe",
    capital: "Reykjavik", topLevelDomain: [".is"], currencies: [{ name: "Icelandic króna" }], languages: [{ name: "Icelandic" }],
    flags: { svg: "https://flagcdn.com/is.svg" }, alpha3Code: "ISL", borders: [],
  },
]);

vi.mock("@/data/data.json", () => ({
  default: mockCountries,
}));

beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

function renderApp(initialEntry = "/") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe("App", () => {
  it("always renders the Header", () => {
    renderApp("/");
    expect(
      screen.getByRole("heading", { level: 1, name: "Where in the world?" }),
    ).toBeInTheDocument();
  });

  it("renders the real Home page at the root path, listing countries", () => {
    renderApp("/");
    expect(screen.getByLabelText("Search for a country")).toBeInTheDocument();
    expect(screen.getByText("France")).toBeInTheDocument();
    expect(screen.getByText("Germany")).toBeInTheDocument();
  });

  it("shows the empty-results message when the search matches nothing", async () => {
    const user = userEvent.setup();
    renderApp("/");

    await user.type(screen.getByLabelText("Search for a country"), "xyz-nope");

    expect(screen.getByText('No countries match "xyz-nope".')).toBeInTheDocument();
  });

  it("renders the real CountryDetailPage at /country/:code, with resolved border links", () => {
    renderApp("/country/FRA");

    expect(screen.getByRole("heading", { name: "France" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Germany" })).toHaveAttribute("href", "/country/DEU");
  });

  it("shows no border country links for a country with no borders", () => {
    renderApp("/country/ISL");

    expect(screen.getByRole("heading", { name: "Iceland" })).toBeInTheDocument();
    expect(screen.queryByText("Border Countries:")).not.toBeInTheDocument();
  });

  it("renders both the RouteAnnouncer live region and Home's status message area", () => {
    renderApp("/");
    // Home's empty-message <p> and RouteAnnouncer's live region both use role="status"
    expect(screen.getAllByRole("status")).toHaveLength(2);
  });

  it("focuses the main content on initial mount", async () => {
    renderApp("/");
    const main = screen.getByRole("main");
    await waitFor(() => expect(main).toHaveFocus());
  });

  it("moves focus back to main content after navigating to a new page", async () => {
    const user = userEvent.setup();
    renderApp("/");
    const main = screen.getByRole("main");

    await waitFor(() => expect(main).toHaveFocus());
    main.blur();
    expect(main).not.toHaveFocus();

    await user.click(screen.getByRole("link", { name: /france/i }));

    await waitFor(() => expect(main).toHaveFocus());
    expect(screen.getByRole("heading", { name: "France" })).toBeInTheDocument();
  });

  it("does not steal focus away when only the search query string changes", async () => {
    const user = userEvent.setup();
    renderApp("/");
    const main = screen.getByRole("main");
    await waitFor(() => expect(main).toHaveFocus());

    const searchInput = screen.getByLabelText("Search for a country");
    await user.click(searchInput);
    await user.type(searchInput, "g");

    // Same route, only the query string changed — focus should stay on the input.
    expect(searchInput).toHaveFocus();
  });
});
