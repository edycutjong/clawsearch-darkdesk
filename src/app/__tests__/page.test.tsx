import { render, screen, fireEvent, act } from '@testing-library/react';
import Home from '../page';

// Mock Header component
jest.mock('@/components/Header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>
}));

describe('Home Page', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    let time = 0;
    jest.spyOn(window.performance, 'now').mockImplementation(() => time);
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      time += 16;
      return setTimeout(() => cb(time), 16) as any as number;
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('renders landing page correctly', () => {
    render(<Home />);
    
    // Check key text elements
    expect(screen.getByText(/Confidential OTC/)).toBeInTheDocument();
    expect(screen.getAllByText(/Dark Pool/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('AI Negotiator')).toBeInTheDocument();
  });

  it('covers count-up animation', () => {
    render(<Home />);
    act(() => {
      jest.advanceTimersByTime(3000);
    });
  });

  it('covers spotlight card mouse move', () => {
    const { container } = render(<Home />);
    const cards = container.querySelectorAll('.spotlight-card');
    
    if (cards.length > 0) {
      const card = cards[0] as HTMLElement;
      Element.prototype.getBoundingClientRect = jest.fn(() => ({
        width: 100, height: 100, top: 10, left: 10, bottom: 110, right: 110, x: 10, y: 10, toJSON: () => {}
      }));
      fireEvent.mouseMove(card, { clientX: 50, clientY: 50 });
      expect(card.style.getPropertyValue('--mouse-x')).toBe('40px');
    }
  });
});
