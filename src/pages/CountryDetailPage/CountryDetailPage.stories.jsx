import { MemoryRouter, Routes, Route } from "react-router-dom";
import { expect } from "storybook/test";
import CountryDetailPage from "./CountryDetailPage";

function withRoute(code) {
  return (Story) => (
    <MemoryRouter initialEntries={[`/country/${code}`]}>
      <Routes>
        <Route path="/country/:code" element={<Story />} />
      </Routes>
    </MemoryRouter>
  );
}

export default {
  title: "Pages/CountryDetail",
  component: CountryDetailPage,
};

export const Default = {
  decorators: [withRoute("FRA")],
  play: async ({ canvas }) => {
    const heading = await canvas.findByRole("heading", { name: "France" });
    await expect(heading).toBeInTheDocument();

    const backButton = canvas.getByRole("button", { name: /back/i });
    await expect(backButton).toBeInTheDocument();
  },
};

export const NotFound = {
  decorators: [withRoute("XXX")],
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Country not found.")).toBeInTheDocument();
  },
};