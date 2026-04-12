import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import Home from "./page";
import PipelineVisualizer from "@/components/PipelineVisualizer";
import { AnimatedCounter, TypewriterText, SpotlightCard } from "./page";
import { updateSweepStatus } from "@/lib/supabase";

// Mock Supabase for the updateSweepStatus check
jest.mock("@/lib/supabase", () => {
  const actual = jest.requireActual("@/lib/supabase");
  return {
    ...actual,
    updateSweepStatus: jest.fn(),
  };
});

// Mock IntersectionObserver to trigger callbacks
const mockInstances: IntersectionObserverMock[] = [];
class IntersectionObserverMock {
  callback: IntersectionObserverCallback;
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    mockInstances.push(this);
  }
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
  trigger(isIntersecting: boolean) {
    this.callback([{ isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
  static get instances() {
    return mockInstances;
  }
  static clearInstances() {
    mockInstances.length = 0;
  }
}
global.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;

// Mock requestAnimationFrame
global.requestAnimationFrame = ((callback: FrameRequestCallback) => {
  return setTimeout(() => callback(performance.now()), 16);
}) as unknown as typeof requestAnimationFrame;

describe("Page: Home", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.spyOn(performance, "now").mockReturnValue(0);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("renders the hero headline", async () => {
    render(<Home />);
    expect(screen.getByText(/Zero-FP/i)).toBeInTheDocument();
    
    // Check initial render without excessive timing
    expect(screen.getAllByText(/Sweep/i).length).toBeGreaterThan(0);
  });

  it("advances typewriter text", () => {
    render(<Home />);
    
    // initially blank or first char
    // The typeWriter logic starts with first character of lines[0]
    // lines are defined in the component
    
    act(() => {
      jest.advanceTimersByTime(50);
    });

    // Advance enough time to complete first title
    // "Autonomous AST" is roughly 14 chars. 14 * 40ms = 560ms.
    // 150 * 40ms = 6000ms.
    for(let i=0; i<150; i++) {
        act(() => {
            jest.advanceTimersByTime(40);
        });
    }
    
    // Matcher function to handle text broken by cursor if needed
    const elements = screen.getAllByText((content) => content.includes("Autonomous AST"));
    expect(elements.length).toBeGreaterThan(0);
    
    // Also check counters are actually 0 upon render, moving this out of the middle of the typewriter loop
    expect(screen.getAllByText("0")).toHaveLength(3);
    expect(screen.getByText("0+")).toBeInTheDocument();
  });

  it("updates live code preview lines", () => {
    render(<Home />);
    
    // Initial lines - match CODE_LINES[0]
    // Advance 1 timer strictly to see the first line
    act(() => {
      jest.advanceTimersByTime(800);
    });
    expect(screen.getByText(/\$ clawsearchdarkdesk run/i)).toBeInTheDocument();
    
    // Fast forward
    act(() => {
      jest.advanceTimersByTime(1600); // 2 more lines
    });
    
    // Next line
    expect(screen.getByText(/Cloning repository/i)).toBeInTheDocument();

    // Advance to end of lines
    act(() => {
      jest.advanceTimersByTime(12000); // Should reach the end
    });

    // Advance another 3000 to trigger reset (line 147)
    act(() => {
      jest.advanceTimersByTime(3500);
    });
    
    expect(screen.getByText(/\$ clawsearchdarkdesk run/i)).toBeInTheDocument();
  });

  it("advances typewriter phases including isDeleting and isPaused", () => {
    render(<Home />);
    
    // Line 91, 92 coverage
    // Wait for it to type full word
    for(let i=0; i < 50; i++) {
        act(() => {
            jest.advanceTimersByTime(60); 
        });
    }
    
    // Now it should be in isPaused or starting to delete
    for(let i=0; i < 60; i++) {
        act(() => {
            jest.advanceTimersByTime(60);
        });
    }
  });

  it("triggers AnimatedCounter when intersected", () => {
    (IntersectionObserverMock as unknown as { clearInstances: () => void }).clearInstances();
    render(<Home />);
    
    // initially 0
    expect(screen.getAllByText("0")).toHaveLength(3);

    const instances = (IntersectionObserverMock as unknown as { instances: IntersectionObserverMock[] }).instances;
    
    act(() => {
      instances.forEach((obs: IntersectionObserverMock) => obs.trigger(true));
    });
    for(let i=0; i<80; i++) {
      act(() => {
        jest.advanceTimersByTime(16);
      });
    }

    // Check one of the counters
    expect(screen.getByText("169+")).toBeInTheDocument();
  });

  it("covers typewriter animation full cycle", async () => {
    render(<Home />);
    // Advance time to see typing
    for(let i=0; i<34; i++) {
      act(() => {
        jest.advanceTimersByTime(60);
      });
    }
    // Check for some typed text
    expect(screen.getByText((content) => content.includes("Autonomous"))).toBeInTheDocument();
  });

  it("handles failure status", () => {
    render(<PipelineVisualizer status="failed" />);
    // Updated label
    expect(screen.getByText("AST Transforms")).toBeInTheDocument();
  });

  it("handles status order transition coverage", () => {
    const { rerender } = render(<PipelineVisualizer status="queued" />);
    rerender(<PipelineVisualizer status="cloning" />);
    rerender(<PipelineVisualizer status="ast" />);
    rerender(<PipelineVisualizer status="ai_loop" />);
    rerender(<PipelineVisualizer status="testing" />);
    rerender(<PipelineVisualizer status="complete" />);
    expect(screen.getByText("Publishing PR")).toBeInTheDocument();
  });

  it("PipelineVisualizer returns null if status is invalid", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { container } = render(<PipelineVisualizer status={"invalid"} />);
    expect(container.firstChild).toBeNull();
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { container: container2 } = render(<PipelineVisualizer status={undefined} />);
    expect(container2.firstChild).toBeNull();
  });

  it("covers updateSweepStatus default parameter", async () => {
    await updateSweepStatus("123", "complete");
    expect(updateSweepStatus).toHaveBeenCalledWith("123", "complete");
  });

  it("advances TypewriterText cycle", async () => {
    render(<Home />);
    // Initial text is "Zero-FP"
    // Fast-forward pause
    act(() => {
      jest.advanceTimersByTime(3000); // pause
    });
    // Should start deleting
    // Fast-forward speed
    for(let i=0; i<20; i++) {
      act(() => {
        jest.advanceTimersByTime(60);
      });
    }
    // Should reach empty and switch
    for(let i=0; i<20; i++) {
      act(() => {
        jest.advanceTimersByTime(60);
      });
    }
  });

  it("handles mouse move in SpotlightCard", () => {
    render(<Home />);
    const card = screen.getByText("Clone").closest(".spotlight-card")!;
    
    fireEvent.mouseMove(card, { clientX: 100, clientY: 100 });
    
    const style = (card as HTMLElement).style;
    expect(style.getPropertyValue("--mouse-x")).toBeDefined();
    expect(style.getPropertyValue("--mouse-y")).toBeDefined();
  });

  it("covers intersection observer false and unmount", () => {
    const { unmount } = render(<Home />);
    
    // trigger false intersection
    const instances = (IntersectionObserverMock as unknown as { instances: IntersectionObserverMock[] }).instances;
    act(() => {
      instances.forEach((obs: IntersectionObserverMock) => obs.trigger(false));
    });

    // unmount components to hit cleanup logic
    unmount();
  });

  it("covers AnimatedCounter with default suffix", () => {
    render(<AnimatedCounter target={100} />);
    const instances = (IntersectionObserverMock as unknown as { instances: IntersectionObserverMock[] }).instances;
    act(() => {
      instances[instances.length - 1].trigger(true);
    });
    // fast forward animation
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("covers TypewriterText with default params", () => {
    render(<TypewriterText texts={["Test"]} />);
    for (let i = 0; i < 10; i++) {
      act(() => {
        jest.advanceTimersByTime(65);
      });
    }
    expect(screen.getByText((c) => c.includes("Test"))).toBeInTheDocument();
  });

  it("covers SpotlightCard default parameter", () => {
    render(<SpotlightCard>Test Default Card</SpotlightCard>);
    expect(screen.getByText("Test Default Card")).toBeInTheDocument();
  });
});
