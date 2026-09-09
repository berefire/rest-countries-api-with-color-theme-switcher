import { MemoryRouter } from "react-router-dom";
import { expect } from "storybook/test";
import CountryDetail from "./CountryDetail";

const sampleCountry = {
  name: "France",
  nativeName: "France",
  population: 66710893,
  region: "Europe",
  subregion: "Western Europe",
  capital: "Paris",
  topLevelDomain: [".fr"],
  currencies: [{ code: "EUR", name: "Euro", symbol: "€" }],
  languages: [{ iso639_1: "fr", name: "French" }],
  flags: { svg: "https://flagcdn.com/fr.svg" },
};

const sampleBorders = [
  { name: "Germany", alpha3Code: "DEU" },
  { name: "Spain", alpha3Code: "ESP" },
  { name: "Belgium", alpha3Code: "BEL" },
];

export default {
  title: "Components/CountryDetail",
  component: CountryDetail,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export const WithBorders = {
  args: { country: sampleCountry, borderCountries: sampleBorders },
  play: async ({ canvas }) => {
    const heading = await canvas.findByRole("heading", { name: "France" });
    await expect(heading).toBeInTheDocument();

    await expect(canvas.getByText("66,710,893")).toBeInTheDocument();
    await expect(canvas.getByText("Euro")).toBeInTheDocument();
    await expect(canvas.getByText("French")).toBeInTheDocument();

    const borderLinks = canvas.getAllByRole("link");
    await expect(borderLinks).toHaveLength(sampleBorders.length);
    await expect(canvas.getByRole("link", { name: "Germany" })).toHaveAttribute("href", "/country/DEU");
  },
};

export const WithoutBorders = {
  args: { country: sampleCountry, borderCountries: [] },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText("Border Countries:")).not.toBeInTheDocument();
  },
};