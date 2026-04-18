import { render, screen } from '@testing-library/react';
import { SplitScreenVerifier } from '../SplitScreenVerifier';

describe('SplitScreenVerifier', () => {
  it('renders public Arbiscan view', () => {
    render(<SplitScreenVerifier />);
    expect(screen.getByText('Public Arbiscan')).toBeInTheDocument();
    expect(screen.getByText('[OBFUSCATED C-TOKEN]')).toBeInTheDocument();
    expect(screen.getByText('0xEncryptedPayload...')).toBeInTheDocument();
  });

  it('renders private iExec view', () => {
    render(<SplitScreenVerifier />);
    expect(screen.getByText('iExec TEE')).toBeInTheDocument();
    expect(screen.getByText('100,000 cUSDC')).toBeInTheDocument();
    expect(screen.getByText(/Atomic Execution/)).toBeInTheDocument();
  });

  it('renders data flow connector', () => {
    render(<SplitScreenVerifier />);
    expect(screen.getByText('Public')).toBeInTheDocument();
    expect(screen.getByText('Private')).toBeInTheDocument();
  });
});
