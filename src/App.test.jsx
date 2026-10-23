import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Link } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeProvider";
import App from "./App";

beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

vi.mock("@/pages/Home/Home", () => ({
  default: () => (
    <div>
      Home page content
      <input aria-label="Search" />
      <Link to="/?q=test">Update search param</Link>
      <Link to="/country/FRA">Go to France</Link>
    </div>
  ),
}));

vi.mock("@/pages/CountryDetailPage/CountryDetailPage", () => ({
  default: () => <div>Country detail content</div>,
}));

function renderApp(initialEntry = "/") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe("App", () => {
  it("always renders the Header", () => {
    renderApp("/");
    expect(
      screen.getByRole("heading", { level: 1, name: "Where in the world?" }),
    ).toBeInTheDocument();
  });

  it("renders Home at the root path", () => {
    renderApp("/");
    expect(screen.getByText("Home page content")).toBeInTheDocument();
  });

  it("renders CountryDetailPage at /country/:code", () => {
    renderApp("/country/FRA");
    expect(screen.getByText("Country detail content")).toBeInTheDocument();
  });

  it("renders the RouteAnnouncer live region", () => {
    renderApp("/");
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("focuses the main content on initial mount", async () => {
    renderApp("/");
    const main = screen.getByRole("main");
    await waitFor(() => expect(main).toHaveFocus());
  });

  it("moves focus back to main content after navigating to a new page", async () => {
    const user = userEvent.setup();
    renderApp("/");
    const main = screen.getByRole("main");

    await waitFor(() => expect(main).toHaveFocus());
    main.blur();
    expect(main).not.toHaveFocus();

    await user.click(screen.getByRole("link", { name: "Go to France" }));

    await waitFor(() => expect(main).toHaveFocus());
    expect(screen.getByText("Country detail content")).toBeInTheDocument();
  });

  it("does not steal focus away when only the search query string changes", async () => {
    const user = userEvent.setup();
    renderApp("/");
    const main = screen.getByRole("main");
    await waitFor(() => expect(main).toHaveFocus());

    const updateSearchLink = screen.getByRole("link", {
      name: "Update search param",
    });
    await user.click(updateSearchLink);

    // Clicking naturally moves focus to the link itself. The bug would be
    // the effect then yanking focus back to <main> just because the query
    // string changed, even though the route (pathname) stayed the same.
    expect(updateSearchLink).toHaveFocus();
  });
});
