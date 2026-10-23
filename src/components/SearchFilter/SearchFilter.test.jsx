import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import SearchFilter from "./SearchFilter";

function SearchFilterHarness({ initialSearchTerm = "", initialRegion = "" }) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [region, setRegion] = useState(initialRegion);

  return (
    <SearchFilter
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      region={region}
      setRegion={setRegion}
    />
  );
}

function renderFilter(props) {
  return render(<SearchFilterHarness {...props} />);
}

describe("SearchFilter", () => {
  it("updates the search input's value as the user types", async () => {
    const user = userEvent.setup();
    renderFilter();

    const input = screen.getByLabelText("Search for a country");
    await user.type(input, "fra");

    expect(input).toHaveValue("fra");
  });

  it("shows 'All' in the trigger's accessible name when no region is selected", () => {
    renderFilter();
    expect(screen.getByRole("combobox", { name: /filter by region: all/i })).toBeInTheDocument();
  });

  it("opens the region list on click and selects a region on click", async () => {
    const user = userEvent.setup();
    renderFilter();

    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("option", { name: "Europe" }));

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAccessibleName("Filter by region: Europe");
  });

  it("closes the list when clicking outside the component", async () => {
    const user = userEvent.setup();
    renderFilter();

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(document.body);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("navigates and selects a region with the keyboard", async () => {
    const user = userEvent.setup();
    renderFilter();

    const trigger = screen.getByRole("combobox");
    trigger.focus();

    await user.keyboard("{ArrowDown}"); // opens, activates "Africa"
    expect(trigger).toHaveAttribute("aria-activedescendant", "region-option-Africa");

    await user.keyboard("{ArrowDown}"); // moves to "Americas"
    expect(trigger).toHaveAttribute("aria-activedescendant", "region-option-Americas");

    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAccessibleName("Filter by region: Americas");
  });

  it("wraps to the last option when ArrowUp opens the list", async () => {
    const user = userEvent.setup();
    renderFilter();

    const trigger = screen.getByRole("combobox");
    trigger.focus();

    await user.keyboard("{ArrowUp}");
    expect(trigger).toHaveAttribute("aria-activedescendant", "region-option-Oceania");
  });

  it("closes without changing the selected region when Escape is pressed", async () => {
    const user = userEvent.setup();
    renderFilter({ initialRegion: "Asia" });

    const trigger = screen.getByRole("combobox");
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAccessibleName("Filter by region: Asia");
  });

  it("jumps to the region starting with a typed letter", async () => {
    const user = userEvent.setup();
    renderFilter();

    const trigger = screen.getByRole("combobox");
    trigger.focus();

    await user.keyboard("o"); // only "Oceania" starts with "o"
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-activedescendant", "region-option-Oceania");
  });
});