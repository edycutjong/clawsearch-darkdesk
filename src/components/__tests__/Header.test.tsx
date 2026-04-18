import { render, screen, fireEvent, act } from '@testing-library/react';
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

  it('handles scroll event to update class', () => {
    const { container } = render(<Header />);
    expect(container.firstChild).toHaveClass('header-top');
    
    act(() => {
      window.scrollY = 50;
      window.dispatchEvent(new Event('scroll'));
    });
    
    expect(container.firstChild).toHaveClass('header-scrolled');
  });
});
