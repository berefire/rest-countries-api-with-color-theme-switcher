import { useState } from "react";
import { expect } from "storybook/test";
import SearchFilter from "./SearchFilter";

function SearchFilterWithState(args) {
  const [searchTerm, setSearchTerm] = useState(args.searchTerm ?? "");
  const [region, setRegion] = useState(args.region ?? "");

  return (
    <SearchFilter
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      region={region}
      setRegion={setRegion}
    />
  );
}

export default {
  title: "Components/SearchFilter",
  component: SearchFilter,
  render: (args) => <SearchFilterWithState {...args} />,
};

export const SearchByName = {
  play: async ({ canvas, userEvent }) => {
    const searchInput = canvas.getByLabelText("Search for a country");
    await userEvent.type(searchInput, "fra");
    await expect(searchInput).toHaveValue("fra");
  },
};

export const FilterByRegion = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("combobox", { name: /filter by region/i });
    await userEvent.click(trigger);
    const option = canvas.getByRole("option", { name: "Europe" });
    await userEvent.click(option);
    await expect(trigger).toHaveTextContent("Europe");
  },
};

export const SearchAndRegionCombined = {
  play: async ({ canvas, userEvent }) => {
    const searchInput = canvas.getByLabelText("Search for a country");
    await userEvent.type(searchInput, "g");
    const trigger = canvas.getByRole("combobox", { name: /filter by region/i });
    await userEvent.click(trigger);
    const option = canvas.getByRole("option", { name: "Europe" });
    await userEvent.click(option);
    await expect(trigger).toHaveTextContent("Europe");
    await expect(searchInput).toHaveValue("g");
  },
};