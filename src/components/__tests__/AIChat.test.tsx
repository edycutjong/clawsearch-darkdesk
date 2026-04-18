import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AIChat } from '../AIChat';

// Mock scrollToBottom
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('AIChat', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it('renders initial message', () => {
    render(<AIChat />);
    expect(screen.getByText(/DarkDesk Terminal initialized/)).toBeInTheDocument();
  });

  it('handles user input and API success', async () => {
    const mockChunk = new TextEncoder().encode('Hello Trader');
    
    // Create a mock reader
    const mockReader = {
      read: jest.fn()
        .mockResolvedValueOnce({ done: false, value: mockChunk })
        .mockResolvedValueOnce({ done: true, value: undefined }),
      releaseLock: jest.fn()
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: {
        getReader: () => mockReader
      }
    });

    render(<AIChat />);
    
    const input = screen.getByPlaceholderText(/Sell 100,000 cUSDC/);
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Buy cT-BILL' } });
    fireEvent.click(button);

    expect(screen.getByText('Buy cT-BILL')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Hello Trader')).toBeInTheDocument();
    });
  });

  it('handles API error', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<AIChat />);
    
    const input = screen.getByPlaceholderText(/Sell 100,000 cUSDC/);
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Testing error' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/\[SYSTEM ERROR\]/)).toBeInTheDocument();
    });
  });
});
