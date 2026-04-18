import { render, screen } from '@testing-library/react';
import Home from '../page';

// Mock Header component
jest.mock('@/components/Header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>
}));

describe('Home Page', () => {
  it('renders landing page correctly', () => {
    render(<Home />);
    
    // Check key text elements
    expect(screen.getByText(/Confidential OTC/)).toBeInTheDocument();
    expect(screen.getAllByText(/Dark Pool/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Trade tokenized Real World Assets/)).toBeInTheDocument();
    expect(screen.getByText('Initialize Secure Terminal')).toBeInTheDocument();
    expect(screen.getByText('AI Negotiator')).toBeInTheDocument();
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
  });
});
