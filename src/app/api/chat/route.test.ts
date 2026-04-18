import { POST } from './route';
import { negotiateTrade } from '@/lib/chaingpt';
import { getTBillYield, getStockPrice } from '@/lib/alpaca';
import { NextRequest } from 'next/server';

jest.mock('next/server', () => {
  return {
    NextRequest: class MockReq {
      constructor(public url: string, public init: Record<string, unknown>) {}
      async json() { return JSON.parse(this.init.body as string); }
    },
    NextResponse: {
      json: (data: unknown, init?: { status?: number }) => ({
        json: async () => data,
        status: init?.status || 200
      })
    }
  };
});

jest.mock('@/lib/chaingpt', () => ({
  negotiateTrade: jest.fn(),
}));

jest.mock('@/lib/alpaca', () => ({
  getTBillYield: jest.fn(),
  getStockPrice: jest.fn(),
}));

describe('/api/chat', () => {
  it('returns stream from chaingpt', async () => {
    (getTBillYield as jest.Mock).mockResolvedValue(4.55);
    (getStockPrice as jest.Mock).mockResolvedValue(180.0);
    
    // Use a simple object to simulate stream response
    const mockStream = { isStream: true };
    (negotiateTrade as jest.Mock).mockResolvedValue(mockStream);
    
    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Sell 100 cUSDC' }),
    });

    const response = await POST(req as unknown as NextRequest);
    expect(response).toEqual(mockStream);
  });

  it('handles error gracefully', async () => {
    (getTBillYield as jest.Mock).mockRejectedValue(new Error('Network error'));

    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Sell 100 cUSDC' }),
    });

    const response = await POST(req as unknown as NextRequest);
    expect(response.status).toBe(500);
  });
});
