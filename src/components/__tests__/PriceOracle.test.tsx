import { render, screen } from '@testing-library/react';
import { PriceOracle } from '../PriceOracle';
import { useQuery } from '@tanstack/react-query';

// Mock react-query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

const mockUseQuery = useQuery as jest.Mock;

describe('PriceOracle', () => {
  it('renders loading state', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });
    render(<PriceOracle />);
    expect(screen.getByText('Initializing Oracle Feeds...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    });
    render(<PriceOracle />);
    expect(screen.getByText('ERROR: Oracle connection lost')).toBeInTheDocument();
  });

  it('renders price data correctly', () => {
    mockUseQuery.mockReturnValue({
      data: {
        success: true,
        data: {
          tbill: { symbol: 'cT-BILL', name: 'Tokenized Treasury Bill', yield: 4.75, change: 0.05 },
          reference: { symbol: 'SPY', price: 512.45, change: -0.12 },
        },
      },
      isLoading: false,
      isError: false,
    });
    render(<PriceOracle />);
    
    expect(screen.getByText('cT-BILL')).toBeInTheDocument();
    expect(screen.getByText('4.75% APY')).toBeInTheDocument();
    expect(screen.getByText('SPY')).toBeInTheDocument();
    expect(screen.getByText('$512.45')).toBeInTheDocument();
  });

  it('calls fetch when queryFn executes', async () => {
    // Setup a mock implementation that doesn't crash on render
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });
    
    render(<PriceOracle />);
    
    // Get the arguments passed to useQuery (the options object)
    const queryOptions = mockUseQuery.mock.calls[mockUseQuery.mock.calls.length - 1][0];
    
    // Mock global.fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { tbill: {}, reference: {} } })
    });
    
    const result = await queryOptions.queryFn();
    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith('/api/price');
    
    // Test the error path
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
    });
    
    await expect(queryOptions.queryFn()).rejects.toThrow('Network response was not ok');
  });
});
