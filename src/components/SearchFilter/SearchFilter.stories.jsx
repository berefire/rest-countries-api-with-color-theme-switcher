import { expect, fn } from "storybook/test";
import SearchFilter from "./SearchFilter";

const sampleCountries = [
  { name: "France", region: "Europe" },
  { name: "Germany", region: "Europe" },
  { name: "Canada", region: "Americas" },
  { name: "Japan", region: "Asia" },
  { name: "Australia", region: "Oceania" },
];

export default {
  title: "Components/SearchFilter",
  component: SearchFilter,
  args: {
    allCountries: sampleCountries,
    setCountries: fn(),
  },
};

export const SearchByName = {
  play: async ({ args, canvas, userEvent }) => {
    const searchInput = canvas.getByLabelText("Search for a country");
    await userEvent.type(searchInput, "fra");

    const lastCall = args.setCountries.mock.calls.at(-1)[0];
    await expect(lastCall).toEqual([sampleCountries[0]]);
  },
};

export const FilterByRegion = {
  play: async ({ args, canvas, userEvent }) => {
    const regionSelect = canvas.getByLabelText("Filter by region");
    await userEvent.selectOptions(regionSelect, "Europe");

    const lastCall = args.setCountries.mock.calls.at(-1)[0];
    await expect(lastCall).toEqual([sampleCountries[0], sampleCountries[1]]);
  },
};

export const SearchAndRegionCombined = {
  play: async ({ args, canvas, userEvent }) => {
    const searchInput = canvas.getByLabelText("Search for a country");
    const regionSelect = canvas.getByLabelText("Filter by region");

    await userEvent.type(searchInput, "g");
    await userEvent.selectOptions(regionSelect, "Europe");

    const lastCall = args.setCountries.mock.calls.at(-1)[0];
    await expect(lastCall).toEqual([sampleCountries[1]]);
  },
};