import { render, screen } from '@testing-library/react';
import NotFound from '../not-found';

// Mock Header component
jest.mock('@/components/Header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>
}));

describe('Not Found Page', () => {
  it('renders 404 page correctly', () => {
    render(<NotFound />);
    
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('> [MARKET_NOT_FOUND]')).toBeInTheDocument();
    expect(screen.getByText(/hidden in the dark pool/i)).toBeInTheDocument();
    expect(screen.getByText('RETURN TO TRADING DESK')).toBeInTheDocument();
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
  });
});
