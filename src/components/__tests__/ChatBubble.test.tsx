import { render, screen } from '@testing-library/react';
import { ChatBubble } from '../ChatBubble';

describe('ChatBubble', () => {
  it('renders user message correctly', () => {
    render(<ChatBubble role="user" content="Hello World" />);
    expect(screen.getByText('Trader')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders assistant message correctly', () => {
    render(<ChatBubble role="assistant" content="I am an AI" />);
    expect(screen.getByText('ChainGPT Negotiator')).toBeInTheDocument();
    expect(screen.getByText('I am an AI')).toBeInTheDocument();
  });
});
