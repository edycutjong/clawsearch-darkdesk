import { getStockPrice, getTBillYield } from '../alpaca';

describe('alpaca lib', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('no API keys (fallback)', () => {
    beforeEach(() => {
      delete process.env.ALPACA_API_KEY;
      delete process.env.ALPACA_API_SECRET;
    });

    it('getTBillYield returns 4.72 fallback', async () => {
      const yieldResult = await getTBillYield();
      expect(yieldResult).toBe(4.72);
    });

    it('getStockPrice returns fallback mapped value', async () => {
      const price = await getStockPrice('AAPL');
      expect(price).toBe(173.50);
      
      const missingPrice = await getStockPrice('UNKNOWN');
      expect(missingPrice).toBe(100.00);
    });
  });

  describe('with API keys', () => {
    beforeEach(() => {
      process.env.ALPACA_API_KEY = 'test_key';
      process.env.ALPACA_API_SECRET = 'test_secret';
      global.fetch = jest.fn();
    });

    it('fetches TBill yield successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ bar: { c: 5.12 } })
      });

      const yieldResult = await getTBillYield();
      expect(yieldResult).toBe(5.12);
    });

    it('handles TBill fetch error with fallback', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
      const yieldResult = await getTBillYield();
      expect(yieldResult).toBe(4.72);
    });

    it('fetches stock price successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ bar: { c: 200.50 } })
      });

      const price = await getStockPrice('AAPL');
      expect(price).toBe(200.50);
    });

    it('handles stock price fetch error with fallback', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
      const price = await getStockPrice('AAPL');
      expect(price).toBe(100.00);
    });
  });
});
