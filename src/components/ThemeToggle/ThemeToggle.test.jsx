import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "@/hooks/useTheme.js";

vi.mock("@/hooks/useTheme.js", () => ({
  useTheme: vi.fn(),
}));

afterEach(() => {
  delete document.startViewTransition;
});

describe("ThemeToggle", () => {
  it("shows 'Dark Mode' and aria-pressed=false when isDark is false", () => {
    useTheme.mockReturnValue({ isDark: false, toggleTheme: vi.fn() });
    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: /dark mode/i });
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("shows 'Light Mode' and aria-pressed=true when isDark is true", () => {
    useTheme.mockReturnValue({ isDark: true, toggleTheme: vi.fn() });
    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: /light mode/i });
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("sets --x and --y CSS variables on the document based on the click position", () => {
    useTheme.mockReturnValue({ isDark: false, toggleTheme: vi.fn() });
    render(<ThemeToggle />);

    fireEvent.click(screen.getByRole("button"), { clientX: 150, clientY: 80 });

    expect(document.documentElement.style.getPropertyValue("--x")).toBe("150px");
    expect(document.documentElement.style.getPropertyValue("--y")).toBe("80px");
  });

  it("calls toggleTheme directly when the browser has no View Transitions support", async () => {
    const toggleTheme = vi.fn();
    useTheme.mockReturnValue({ isDark: false, toggleTheme });
    expect(document.startViewTransition).toBeUndefined(); // jsdom doesn't implement it

    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole("button"));

    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });

  it("wraps toggleTheme in startViewTransition when the browser supports it", async () => {
    const toggleTheme = vi.fn();
    useTheme.mockReturnValue({ isDark: false, toggleTheme });

    const startViewTransition = vi.fn((callback) => {
      callback();
      return {
        ready: Promise.resolve(),
        finished: Promise.resolve(),
        updateCallbackDone: Promise.resolve(),
      };
    });
    document.startViewTransition = startViewTransition;

    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole("button"));

    expect(startViewTransition).toHaveBeenCalledTimes(1);
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });
});