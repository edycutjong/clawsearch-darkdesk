import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Header', () => {
  it('renders correctly', () => {
    render(<Header />);
    expect(screen.getByText('ClawSearch')).toBeInTheDocument();
    expect(screen.getByText('DarkDesk')).toBeInTheDocument();
    expect(screen.getByText('Dark Pool')).toBeInTheDocument();
    expect(screen.getByText('Docs')).toBeInTheDocument();
  });

  it('renders source link', () => {
    render(<Header />);
    expect(screen.getByText('Source')).toBeInTheDocument();
  });
});
