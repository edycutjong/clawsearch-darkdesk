import { render, screen, fireEvent, act } from '@testing-library/react';
import { DarkDeskEscrow } from '../DarkDeskEscrow';

describe('DarkDeskEscrow', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders initial idle state', () => {
    render(<DarkDeskEscrow />);
    expect(screen.getByText('Execution Block')).toBeInTheDocument();
    expect(screen.getByText('Awaiting AI Negotiation')).toBeInTheDocument();
  });

  it('renders simulate button', () => {
    render(<DarkDeskEscrow />);
    expect(screen.getByText('Simulate Escrow Flow')).toBeInTheDocument();
  });

  it('progresses through escrow states when simulated', () => {
    render(<DarkDeskEscrow />);
    
    const button = screen.getByText('Simulate Escrow Flow');
    fireEvent.click(button);

    // Should immediately show 'created' state
    expect(screen.getByText('Contract Deployed via iExec')).toBeInTheDocument();

    // Advance to 'funded' state
    act(() => { jest.advanceTimersByTime(2000); });
    expect(screen.getByText('Counterparties Funded')).toBeInTheDocument();

    // Advance to 'executed' state
    act(() => { jest.advanceTimersByTime(2000); });
    expect(screen.getByText('Atomic Swap Executed')).toBeInTheDocument();
  });
});
