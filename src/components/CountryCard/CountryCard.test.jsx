import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CountryCard from "./CountryCard";

const baseCountry = {
  name: "Canada",
  population: 37058856,
  region: "Americas",
  capital: "Ottawa",
  flags: { svg: "https://flagcdn.com/ca.svg" },
  alpha3Code: "CAN",
};

function renderCard(country) {
  return render(
    <MemoryRouter>
      <ul>
        <CountryCard country={country} />
      </ul>
    </MemoryRouter>
  );
}

describe("CountryCard", () => {
  it("renders the country's name, region, population, and capital", () => {
    renderCard(baseCountry);

    expect(screen.getByRole("heading", { name: "Canada" })).toBeInTheDocument();
    expect(screen.getByText("Americas")).toBeInTheDocument();
    expect(screen.getByText("37,058,856")).toBeInTheDocument();
    expect(screen.getByText("Ottawa")).toBeInTheDocument();
  });

  it("renders the flag image with the correct src and accessible alt text", () => {
    renderCard(baseCountry);

    const image = screen.getByRole("img", { name: "Flag of Canada" });
    expect(image).toHaveAttribute("src", baseCountry.flags.svg);
  });

  it("links to the country's detail page using its alpha3Code", () => {
    renderCard(baseCountry);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/country/CAN");
  });

  it('shows "N/A" when capital is undefined', () => {
    renderCard({ ...baseCountry, capital: undefined });
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it('shows "N/A" when capital is an empty array (the real REST Countries shape for no capital)', () => {
    renderCard({ ...baseCountry, capital: [] });
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });
});