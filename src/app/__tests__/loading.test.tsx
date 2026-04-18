import { render, screen } from '@testing-library/react';
import Loading from '../loading';

describe('Loading Page', () => {
  it('renders loading UI correctly', () => {
    render(<Loading />);
    expect(screen.getByText('Loading AI engine...')).toBeInTheDocument();
  });
});
