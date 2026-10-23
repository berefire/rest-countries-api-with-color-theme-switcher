import Header from "./Header";
import { ThemeProvider } from "@/context/ThemeProvider";
import { MemoryRouter } from "react-router-dom";
import { expect, waitFor } from "storybook/test";

export default {
  title: "Components/Header",
  component: Header,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ThemeProvider>
          <Story />
        </ThemeProvider>
      </MemoryRouter>
    ),
  ],
};

export const Default = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const heading = canvas.getByRole("heading", {
      level: 1,
      name: "Where in the world?",
    });
    await expect(heading).toBeInTheDocument();

    const toggleButton = canvas.getByRole("button");
    await expect(toggleButton).toBeInTheDocument();

    const docEl = canvasElement.ownerDocument.documentElement;
    const initialLabel = toggleButton.textContent;
    const wasDark = docEl.classList.contains("dark");

    await userEvent.click(toggleButton);

    await expect(toggleButton).not.toHaveTextContent(initialLabel);
    await waitFor(() => {
      expect(docEl.classList.contains("dark")).toBe(!wasDark);
    });
  },
};
