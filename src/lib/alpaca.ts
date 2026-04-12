const ALPACA_BASE = process.env.ALPACA_BASE_URL || 'https://paper-api.alpaca.markets';

export async function getTBillYield(): Promise<number> {
  // If no keys, return a mocked premium yield for the demo
  if (!process.env.ALPACA_API_KEY || !process.env.ALPACA_API_SECRET) {
    return 4.72;
  }

  try {
    // Using BIL ETF as a proxy for 1-3 Month Treasury Bill yields
    const res = await fetch(`${ALPACA_BASE}/v2/stocks/BIL/bars/latest`, {
      headers: {
        'APCA-API-KEY-ID': process.env.ALPACA_API_KEY,
        'APCA-API-SECRET-KEY': process.env.ALPACA_API_SECRET,
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (!res.ok) throw new Error('Alpaca API error');
    
    const data = await res.json();
    return data.bar?.c || 4.72;
  } catch (error) {
    console.error('Failed to fetch Alpaca yield, using fallback', error);
    return 4.72;
  }
}

export async function getStockPrice(symbol: string): Promise<number> {
  if (!process.env.ALPACA_API_KEY || !process.env.ALPACA_API_SECRET) {
    // Mock fallbacks for standard demo assets
    const fallbacks: Record<string, number> = {
      'AAPL': 173.50,
      'TSLA': 190.20,
    };
    return fallbacks[symbol] || 100.00;
  }

  try {
    const res = await fetch(`${ALPACA_BASE}/v2/stocks/${symbol}/bars/latest`, {
      headers: {
        'APCA-API-KEY-ID': process.env.ALPACA_API_KEY,
        'APCA-API-SECRET-KEY': process.env.ALPACA_API_SECRET,
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (!res.ok) throw new Error('Alpaca API error');

    const data = await res.json();
    return data.bar?.c || 100.00;
  } catch (error) {
    console.error(`Failed to fetch Alpaca price for ${symbol}, using fallback`, error);
    return 100.00;
  }
}
