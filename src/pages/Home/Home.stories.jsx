import { MemoryRouter } from "react-router-dom";
import { expect } from "storybook/test";
import Home from "./Home";
import countriesData from "@/data/data.json";

export default {
  title: "Pages/Home",
  component: Home,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export const Default = {
  play: async ({ canvas }) => {
    const links = await canvas.findAllByRole("link");
    await expect(links).toHaveLength(countriesData.length);
  },
};