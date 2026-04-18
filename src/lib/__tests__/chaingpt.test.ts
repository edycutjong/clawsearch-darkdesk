import { negotiateTrade } from '../chaingpt';

describe('chaingpt lib', () => {
  const originalEnv = process.env;
  
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    jest.useFakeTimers();
  });

  afterAll(() => {
    process.env = originalEnv;
    jest.useRealTimers();
  });

  it('uses mock stream when no API key is provided', async () => {
    delete process.env.CHAINGPT_API_KEY;
    
    const responsePromise = negotiateTrade('hello', { marketData: { tbillYield: 4.5, referencePrice: 100 } });
    
    // Fast-forward timers to skip the 50ms delays inside start()
    for(let i=0; i<100; i++) {
        jest.advanceTimersByTime(50);
    }
    
    const response = await responsePromise;
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('Content-Type')).toBe('text/plain');
    
    // We can test reading from the stream
    const reader = response.body?.getReader();
    const { done, value } = await reader!.read();
    expect(done).toBe(false);
    expect(value).toBeDefined();
  });

  it('calls fetch when API key is provided', async () => {
    process.env.CHAINGPT_API_KEY = 'my_test_key';
    const mockResponse = new Response('test');
    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const response = await negotiateTrade('hello', { marketData: { tbillYield: 4.5, referencePrice: 100 } });
    
    expect(global.fetch).toHaveBeenCalledWith('https://api.chaingpt.org/chat/stream', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        'Authorization': 'Bearer my_test_key'
      })
    }));
    expect(response).toBe(mockResponse);
  });
});
