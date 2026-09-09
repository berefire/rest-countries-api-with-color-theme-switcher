import { expect, fn } from "storybook/test";
import Button from "./Button";
import { BsArrowLeft } from "react-icons/bs";

export default {
  title: "Components/Button",
  component: Button,
  args: {
    onClick: fn(),
  },
};

export const Back = {
  args: {
    children: (
      <>
        <BsArrowLeft aria-hidden="true" className="inline-block" /> Back
      </>
    ),
  },
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const button = canvas.getByRole("button", { name: /back/i });
    const icon = canvasElement.querySelector("svg");

    expect(button).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");

    await userEvent.click(button);

    expect(args.onClick).toHaveBeenCalledOnce();
  },
};
