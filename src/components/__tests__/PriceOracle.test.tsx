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
});
