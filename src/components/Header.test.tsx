import { render, screen, act } from "@testing-library/react";
import Header from "./Header";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("Header", () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue("/");
  });

  it("renders correctly", () => {
    render(<Header />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("handles active state for sub-pages", () => {
    (usePathname as jest.Mock).mockReturnValue("/dashboard/123");
    render(<Header />);
    const dashboardLink = screen.getByText("Dashboard").closest("a");
    expect(dashboardLink).toHaveClass("nav-pill-active");
  });

  it("updates scroll state on window scroll", () => {
    const { getByRole } = render(<Header />);
    const header = getByRole("banner");
    
    // Default state
    expect(header).toHaveClass("header-top");

    // Trigger scroll
    act(() => {
      window.scrollY = 20;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(header).toHaveClass("header-scrolled");

    // Scroll back up
    act(() => {
      window.scrollY = 0;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(header).toHaveClass("header-top");
  });

  it("unmounts cleanly", () => {
    const { unmount } = render(<Header />);
    unmount();
  });
});
