import { MemoryRouter } from "react-router-dom";
import { expect } from "storybook/test";
import CountryCard from "./CountryCard";

const sampleCountry = {
  name: "Canada",
  population: 37058856,
  region: "Americas",
  capital: "Ottawa",
  flags: {
    svg: "https://flagcdn.com/ca.svg",
    png: "https://flagcdn.com/w320/ca.png",
  },
  alpha3Code: "CAN",
};

const countryWithoutCapital = {
  ...sampleCountry,
  name: "Antarctica",
  capital: undefined,
  alpha3Code: "ATA",
};

export default {
  title: "Components/CountryCard",
  component: CountryCard,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export const Default = {
  args: { country: sampleCountry },
  play: async ({ canvas }) => {
    const heading = await canvas.findByRole("heading", { name: "Canada" });
    await expect(heading).toBeInTheDocument();

    const image = canvas.getByRole("img", { name: "Flag of Canada" });
    await expect(image).toHaveAttribute("src", sampleCountry.flags.svg);

    await expect(canvas.getByText("37,058,856")).toBeInTheDocument();
    await expect(canvas.getByText("Ottawa")).toBeInTheDocument();

    const link = canvas.getByRole("link");
    await expect(link).toHaveAttribute("href", "/country/CAN");
  },
};

export const MissingCapital = {
  args: { country: countryWithoutCapital },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("N/A")).toBeInTheDocument();
  },
};