import { NextResponse } from 'next/server';
import { getTBillYield, getStockPrice } from '@/lib/alpaca';

export async function GET() {
  try {
    const tbillYield = await getTBillYield();
    const aaplPrice = await getStockPrice('AAPL');

    return NextResponse.json({
      success: true,
      data: {
        tbill: {
          symbol: 'cT-BILL',
          name: 'Tokenized T-Bill',
          yield: tbillYield,
          change: 0.02, // Simulated daily change
        },
        reference: {
          symbol: 'AAPL',
          price: aaplPrice,
          change: -1.2, // Simulated daily change
        }
      }
    });
  } catch (err) {
    console.error('Price Oracle Error:', err);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch oracle data' 
    }, { status: 500 });
  }
}
