export interface TradeContext {
  marketData: {
    tbillYield: number;
    referencePrice: number;
  };
}

export async function negotiateTrade(message: string, context: TradeContext): Promise<Response> {
  const apiKey = process.env.CHAINGPT_API_KEY;

  if (!apiKey) {
    // Return a mocked simulated stream response when no API key is present
    const stream = new ReadableStream({
      async start(controller) {
        const text = `I see you want to proceed with OTC trading. Current Alpaca T-Bill yields are at ${context.marketData.tbillYield.toFixed(2)}%. Based on our DarkDesk parameters, I can offer an escrow execution at this rate. Would you like me to generate the escrow link for your counterparty?`;
        
        // Simulating the typing effect of a stream
        const chunks = text.split(' ');
        for (const chunk of chunks) {
          controller.enqueue(new TextEncoder().encode(chunk + ' '));
          await new Promise(r => setTimeout(r, 50));
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // Real implementation
  const response = await fetch('https://api.chaingpt.org/chat/stream', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: `You are an institutional OTC dark pool broker AI for ClawSearch DarkDesk. Current market data: ${JSON.stringify(context.marketData)}. Your role is to help negotiate fair OTC prices for tokenized RWAs (like cT-BILL and cUSDC). Always reference the exact T-Bill yield provided. Stay professional, concise, and dense.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      stream: true
    }),
  });

  return response;
}
