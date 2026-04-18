import { render, screen } from '@testing-library/react';
import TradingDeskPage from '../page';

// Mock components
jest.mock('@/components/Header', () => ({ Header: () => <div>Header</div> }));
jest.mock('@/components/AIChat', () => ({ AIChat: () => <div>AIChat</div> }));
jest.mock('@/components/DarkDeskEscrow', () => ({ DarkDeskEscrow: () => <div>DarkDeskEscrow</div> }));
jest.mock('@/components/PriceOracle', () => ({ PriceOracle: () => <div>PriceOracle</div> }));
jest.mock('@/components/SplitScreenVerifier', () => ({ SplitScreenVerifier: () => <div>SplitScreenVerifier</div> }));

describe('Trading Desk Page', () => {
  it('renders standard layout elements', () => {
    render(<TradingDeskPage />);
    expect(screen.getByText('Institutional Trading Desk')).toBeInTheDocument();
    expect(screen.getByText('AI Negotiator')).toBeInTheDocument();
    expect(screen.getByText('Confidential Escrow')).toBeInTheDocument();
    expect(screen.getByText('Live RWA Pricing')).toBeInTheDocument();
    expect(screen.getByText('Dark Pool Analytics')).toBeInTheDocument();
  });
});
