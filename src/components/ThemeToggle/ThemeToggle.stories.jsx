import ThemeToggle from "./ThemeToggle";
import { ThemeProvider } from "@/context/ThemeContext";
import { expect } from "storybook/test";

export default {
  title: "Components/ThemeToggle",
  component: ThemeToggle,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export const Default = {
    args: {},
    play: async({canvas, userEvent}) => {
        const button = canvas.getByRole('button');

        await expect(button).toBeInTheDocument();
        const initialLabel = button.textContent;
        
        await userEvent.click(button);
        await expect(button).not.toHaveTextContent(initialLabel);
    }
};