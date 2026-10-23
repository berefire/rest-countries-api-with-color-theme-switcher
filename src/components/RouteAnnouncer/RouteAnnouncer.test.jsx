import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useNavigate } from "react-router-dom";
import RouteAnnouncer from "./RouteAnnouncer";

function TestHarness() {
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => navigate("/two")}>Go to two</button>
      <Routes>
        <Route path="/one" element={<main><h1>Page One</h1></main>} />
        <Route path="/two" element={<main><h1>Page Two</h1></main>} />
      </Routes>
      <RouteAnnouncer />
    </>
  );
}

describe("RouteAnnouncer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.title = "";
  });

  it("renders a visually hidden live region", () => {
    render(
      <MemoryRouter initialEntries={["/one"]}>
        <main><h1>Home</h1></main>
        <RouteAnnouncer />
      </MemoryRouter>
    );
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveClass("sr-only");
  });

  it("announces the page's h1 after the debounce delay", () => {
    render(
      <MemoryRouter initialEntries={["/one"]}>
        <main><h1>Home page</h1></main>
        <RouteAnnouncer />
      </MemoryRouter>
    );

    expect(screen.getByRole("status")).toHaveTextContent("");

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByRole("status")).toHaveTextContent("Home page");
  });

  it("falls back to document.title when main has no heading", () => {
    document.title = "My App";
    render(
      <MemoryRouter initialEntries={["/one"]}>
        <main />
        <RouteAnnouncer />
      </MemoryRouter>
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByRole("status")).toHaveTextContent("My App");
  });

  it("re-announces when the route actually changes", () => {
    render(
      <MemoryRouter initialEntries={["/one"]}>
        <TestHarness />
      </MemoryRouter>
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByRole("status")).toHaveTextContent("Page One");

    fireEvent.click(screen.getByRole("button", { name: "Go to two" }));

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByRole("status")).toHaveTextContent("Page Two");
  });

  it("cancels a pending announcement if the route changes again before the delay elapses", () => {
    render(
      <MemoryRouter initialEntries={["/one"]}>
        <TestHarness />
      </MemoryRouter>
    );

    act(() => {
      vi.advanceTimersByTime(50); // only halfway through the debounce for "/one"
    });

    fireEvent.click(screen.getByRole("button", { name: "Go to two" }));

    act(() => {
      vi.advanceTimersByTime(100);
    });

    // "Page One" should never have been announced — only the latest route wins
    expect(screen.getByRole("status")).toHaveTextContent("Page Two");
  });
});