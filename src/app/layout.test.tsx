import React from "react";
import { render, screen, act } from "@testing-library/react";
import RootLayout, { metadata } from "./layout";

// Mock Next.js font
jest.mock("next/font/google", () => ({
  Geist: () => ({ variable: "geist-sans" }),
  Geist_Mono: () => ({ variable: "geist-mono" }),
}));

describe("RootLayout", () => {
  it("renders children", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    await act(async () => {
      render(
        <RootLayout>
          <div data-testid="test-child">Content</div>
        </RootLayout>
      );
    });

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it("exports metadata", () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe("ClawSearchDarkDesk — Zero-FP Solana Migration Engine");
  });
});
