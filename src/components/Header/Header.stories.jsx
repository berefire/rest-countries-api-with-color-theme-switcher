import Header from "./Header";
import { ThemeProvider } from "@/context/ThemeContext";
import { expect } from "storybook/test";

export default {
    title: "Components/Header",
    component: Header,
    decorators: [
        (Story) => (
            <ThemeProvider>
                <Story />
            </ThemeProvider>
        ),
    ],
}

export const Default = {
  play: async ({ canvas, userEvent }) => {
    const heading = canvas.getByRole("heading", { level: 1, name: "Where in the world?" });
    await expect(heading).toBeInTheDocument();

    const toggleButton = canvas.getByRole("button");
    await expect(toggleButton).toBeInTheDocument();

    const initialLabel = toggleButton.textContent;
    const wasDark = document.documentElement.classList.contains("dark");

    await userEvent.click(toggleButton);

    await expect(toggleButton).not.toHaveTextContent(initialLabel);
    expect(document.documentElement.classList.contains("dark")).toBe(!wasDark);
  },
};