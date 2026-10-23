import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";

const mockCountries = vi.hoisted(() => [
  { name: "France", region: "Europe", population: 67000000, capital: "Paris", flags: { svg: "https://flagcdn.com/fr.svg" }, alpha3Code: "FRA" },
  { name: "Germany", region: "Europe", population: 83000000, capital: "Berlin", flags: { svg: "https://flagcdn.com/de.svg" }, alpha3Code: "DEU" },
  { name: "Ghana", region: "Africa", population: 31000000, capital: "Accra", flags: { svg: "https://flagcdn.com/gh.svg" }, alpha3Code: "GHA" },
]);

vi.mock("@/data/data.json", () => ({
  default: mockCountries,
}));

function renderHome(initialEntry = "/") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Home />
    </MemoryRouter>
  );
}

describe("Home", () => {
  it("renders every country when no filter is applied", () => {
    renderHome();
    expect(screen.getByText("France")).toBeInTheDocument();
    expect(screen.getByText("Germany")).toBeInTheDocument();
    expect(screen.getByText("Ghana")).toBeInTheDocument();
  });

  it("filters the list as the user types in the search box", async () => {
    const user = userEvent.setup();
    renderHome();

    await user.type(screen.getByLabelText("Search for a country"), "fra");

    expect(screen.getByText("France")).toBeInTheDocument();
    expect(screen.queryByText("Germany")).not.toBeInTheDocument();
  });

  it("filters the list by region", async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(screen.getByRole("combobox", { name: /filter by region/i }));
    await user.click(screen.getByRole("option", { name: "Africa" }));

    expect(screen.getByText("Ghana")).toBeInTheDocument();
    expect(screen.queryByText("France")).not.toBeInTheDocument();
  });

  it("shows a message naming the search term when nothing matches", async () => {
    const user = userEvent.setup();
    renderHome();

    await user.type(screen.getByLabelText("Search for a country"), "xyz-nope");

    expect(screen.getByRole("status")).toHaveTextContent('No countries match "xyz-nope".');
  });

  it("shows a message naming both the search term and region when combined filters match nothing", async () => {
    const user = userEvent.setup();
    renderHome();

    await user.type(screen.getByLabelText("Search for a country"), "ghana");
    await user.click(screen.getByRole("combobox", { name: /filter by region/i }));
    await user.click(screen.getByRole("option", { name: "Europe" }));

    expect(screen.getByRole("status")).toHaveTextContent('No countries match "ghana" in Europe.');
  });

  it("keeps the status region present but empty when there are results", () => {
    renderHome();
    expect(screen.getByRole("status")).toHaveTextContent("");
  });
});