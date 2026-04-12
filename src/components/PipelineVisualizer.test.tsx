import { render, screen } from "@testing-library/react";
import PipelineVisualizer from "./PipelineVisualizer";


describe("PipelineVisualizer", () => {
  const steps = ["Cloning", "AST Transforms", "Compiler-in-the-Loop", "Testing", "Publishing PR"];

  it("renders all pipeline steps", () => {
    render(<PipelineVisualizer status="queued" />);
    steps.forEach((step) => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });
  });

  it("marks steps as 'active' based on status", () => {
    render(<PipelineVisualizer status="ast" />);
    
    // The "AST Transforms" step should have the active class (animate-ring-pulse)
    const astStep = screen.getByText("AST Transforms").closest("div");
    expect(astStep).toHaveClass("animate-ring-pulse");
    expect(astStep).toHaveClass("text-sol-purple");
  });

  it("marks previous steps as 'done'", () => {
    const { container } = render(<PipelineVisualizer status="ai_loop" />);
    
    // "Cloning" and "AST Transforms" should be done
    const cloningStep = screen.getByText("Cloning").closest("div");
    const astStep = screen.getByText("AST Transforms").closest("div");

    expect(cloningStep).toHaveClass("text-sol-green");
    expect(astStep).toHaveClass("text-sol-green");
    
    // Should have the checkmark SVG (text-sol-green represents done state in the component)
    const svgs = container.querySelectorAll("svg.text-sol-green");
    expect(svgs.length).toBeGreaterThanOrEqual(2);
  });

  it("renders null for invalid status", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { container } = render(<PipelineVisualizer status={"invalid"} />);
    expect(container.firstChild).toBeNull();
  });

  it("marks all steps as failed on 'failed' status", () => {
    render(<PipelineVisualizer status="failed" />);
    // On failure, steps should have text-sol-red and no pulse
    const step = screen.getByText("Cloning").closest("div");
    expect(step).toHaveClass("text-sol-red");
    expect(step).not.toHaveClass("animate-ring-pulse");
  });

  it("renders all items as pending when status is queued", () => {
    render(<PipelineVisualizer status="queued" />);
    const allSteps = steps.map(s => screen.getByText(s).closest("div"));
    allSteps.forEach(step => {
      expect(step).toHaveClass("bg-sol-dark/50");
    });
  });

  it("renders all items as done when status is complete", () => {
    render(<PipelineVisualizer status="complete" />);
    const allSteps = steps.map(s => screen.getByText(s).closest("div"));
    allSteps.forEach(step => {
      expect(step).toHaveClass("text-sol-green");
    });
  });
});
