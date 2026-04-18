jest.mock('@rainbow-me/rainbowkit', () => ({
  getDefaultConfig: jest.fn().mockReturnValue({ chains: [{ id: 421614 }] })
}));
jest.mock('wagmi', () => ({
  http: jest.fn()
}));
jest.mock('wagmi/chains', () => ({
  arbitrumSepolia: { id: 421614 }
}));

import { config } from '../wagmi-config';
import { arbitrumSepolia } from 'wagmi/chains';

describe('wagmi-config', () => {
    it('exports a wagmi config', () => {
        expect(config).toBeDefined();
        expect(config.chains).toBeDefined();
        const chains = config.chains;
        expect(chains[0].id).toBe(arbitrumSepolia.id);
    });
});
