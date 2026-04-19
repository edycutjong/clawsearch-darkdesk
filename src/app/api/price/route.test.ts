import { GET } from './route';
import { getTBillYield, getStockPrice } from '@/lib/alpaca';

jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: (data: unknown, init?: { status?: number }) => ({
        json: async () => data,
        status: init?.status || 200
      })
    }
  };
});

jest.mock('@/lib/alpaca', () => ({
  getTBillYield: jest.fn(),
  getStockPrice: jest.fn(),
}));

describe('/api/price', () => {
  it('returns successful price payload', async () => {
    (getTBillYield as jest.Mock).mockResolvedValue(4.55);
    (getStockPrice as jest.Mock).mockResolvedValue(180.0);

    const response = await GET();
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.data.tbill.yield).toBe(4.55);
    expect(data.data.reference.price).toBe(180.0);
  });

  it('handles error gracefully', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (getTBillYield as jest.Mock).mockRejectedValue(new Error('API failure'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Failed to fetch oracle data');
    spy.mockRestore();
  });
});
