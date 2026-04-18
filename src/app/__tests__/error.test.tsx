import { render, screen, fireEvent } from '@testing-library/react';
import GlobalError from '../error';

describe('Global Error Page', () => {
  it('renders error message and try again button', () => {
    const mockReset = jest.fn();
    const mockError = new Error('Test error');

    // Mute console.error for the test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<GlobalError error={mockError} reset={mockReset} />);
    
    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    expect(screen.getByText(/unexpected error/i)).toBeInTheDocument();
    
    const button = screen.getByText('Try again');
    fireEvent.click(button);
    expect(mockReset).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
