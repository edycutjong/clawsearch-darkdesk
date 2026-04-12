import { NextRequest } from 'next/server';
import { negotiateTrade } from '@/lib/chaingpt';
import { getTBillYield, getStockPrice } from '@/lib/alpaca';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    // Fetch the absolute real-time (or cached) market data
    const tbillYield = await getTBillYield();
    const referencePrice = await getStockPrice('AAPL');

    const context = {
      marketData: {
        tbillYield,
        referencePrice
      }
    };

    // This will return an active stream to stream back to the UI
    const proxyStream = await negotiateTrade(message, context);
    
    return proxyStream;
  } catch (error) {
    console.error('Chat API Route Error:', error);
    return new Response('Failed to reach AI Negotiator network.', { status: 500 });
  }
}
