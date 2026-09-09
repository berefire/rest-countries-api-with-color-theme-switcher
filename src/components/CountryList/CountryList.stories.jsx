import { MemoryRouter } from "react-router-dom";
import { expect } from "storybook/test";
import CountryList from "./CountryList";

const sampleCountries = [
  {
    name: "Canada",
    population: 37058856,
    region: "Americas",
    capital: "Ottawa",
    flags: { svg: "https://flagcdn.com/ca.svg" },
    alpha3Code: "CAN",
  },
  {
    name: "Germany",
    population: 82927922,
    region: "Europe",
    capital: "Berlin",
    flags: { svg: "https://flagcdn.com/de.svg" },
    alpha3Code: "DEU",
  },
  {
    name: "Antarctica",
    population: 1000,
    region: "Polar",
    capital: undefined,
    flags: { svg: "https://flagcdn.com/aq.svg" },
    alpha3Code: "ATA",
  },
];

export default {
  title: "Components/CountryList",
  component: CountryList,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export const Default = {
  args: { countries: sampleCountries },
  play: async ({ canvas }) => {
    const headings = await canvas.findAllByRole("heading");
    await expect(headings).toHaveLength(sampleCountries.length);

    await expect(canvas.getByText("Canada")).toBeInTheDocument();
    await expect(canvas.getByText("Germany")).toBeInTheDocument();
    await expect(canvas.getByText("Antarctica")).toBeInTheDocument();

    const links = canvas.getAllByRole("link");
    await expect(links).toHaveLength(sampleCountries.length);
  },
};

export const Empty = {
  args: { countries: [] },
  play: async ({ canvas }) => {
    const links = canvas.queryAllByRole("link");
    await expect(links).toHaveLength(0);
  },
};