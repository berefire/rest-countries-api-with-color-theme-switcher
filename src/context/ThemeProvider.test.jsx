import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useContext } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeContext } from "./theme-context";

function mockMatchMedia(matches) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

function ThemeConsumer() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  return (
    <div>
      <span data-testid="theme-value">{isDark ? "dark" : "light"}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <ThemeProvider>
      <ThemeConsumer />
    </ThemeProvider>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("defaults to the OS preference (dark) when nothing is saved", () => {
    mockMatchMedia(true);
    renderWithProvider();

    expect(screen.getByTestId("theme-value")).toHaveTextContent("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("defaults to light when the OS doesn't prefer dark and nothing is saved", () => {
    mockMatchMedia(false);
    renderWithProvider();

    expect(screen.getByTestId("theme-value")).toHaveTextContent("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("prefers a saved theme over the OS preference", () => {
    mockMatchMedia(false); // OS says light
    localStorage.setItem("theme", "dark"); // but the user previously chose dark

    renderWithProvider();

    expect(screen.getByTestId("theme-value")).toHaveTextContent("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("toggles the theme, updating the DOM class and localStorage", () => {
    mockMatchMedia(false);
    renderWithProvider();

    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));

    expect(screen.getByTestId("theme-value")).toHaveTextContent("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");

    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));

    expect(screen.getByTestId("theme-value")).toHaveTextContent("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("treats any non-'dark' saved value as light, ignoring the OS preference", () => {
    mockMatchMedia(true); // OS prefers dark
    localStorage.setItem("theme", "banana"); // corrupted/unexpected value

    renderWithProvider();

    // Current logic: `if (saved) return saved === "dark"` — any truthy saved
    // value short-circuits the OS fallback, and only the literal string
    // "dark" counts. This locks in that actual behavior rather than assuming
    // a corrupted value would gracefully fall back to the OS preference.
    expect(screen.getByTestId("theme-value")).toHaveTextContent("light");
  });
});