import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeProvider";
import Header from "./Header";

beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

function renderHeader() {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe("Header", () => {
  it("renders the site heading as a link to home", () => {
    renderHeader();
    expect(screen.getByRole("link", { name: "Where in the world?" })).toHaveAttribute("href", "/");
  });

  it("renders the theme toggle button", () => {
    renderHeader();
    expect(screen.getByRole("button", { name: /dark mode|light mode/i })).toBeInTheDocument();
  });

  it("toggles the theme and its own label when clicked", async () => {
    const user = userEvent.setup();
    renderHeader();

    const toggleButton = screen.getByRole("button", { name: /dark mode|light mode/i });
    const initialLabel = toggleButton.textContent;
    const wasDark = document.documentElement.classList.contains("dark");

    await user.click(toggleButton);

    expect(toggleButton).not.toHaveTextContent(initialLabel);
    expect(document.documentElement.classList.contains("dark")).toBe(!wasDark);
  });
});