import React from "react";
import { render, screen, act } from "@testing-library/react";
import ErrorBoundary from "./error";
import Loading from "./loading";
import NotFound from "./not-found";

describe("Pages: Special Boundaries", () => {
  describe("Error Boundary", () => {
    it("renders error message and reset button", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      const reset = jest.fn();
      await act(async () => {
        render(<ErrorBoundary error={new Error("Global Crash")} reset={reset} />);
      });
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
      consoleSpy.mockRestore();
    });
  });

  describe("Loading State", () => {
    it("renders loading skeleton", () => {
      render(<Loading />);
      expect(screen.getByText(/Loading AI engine.../i)).toBeInTheDocument();
    });
  });

  describe("Not Found", () => {
    it("renders 404 message", () => {
      render(<NotFound />);
      expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
      expect(screen.getByText(/Back to Base/i)).toBeInTheDocument();
    });
  });
});
