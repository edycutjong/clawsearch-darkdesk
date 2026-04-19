import { negotiateTrade } from '../chaingpt';

describe('chaingpt lib', () => {
  const originalEnv = process.env;
  
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('uses mock stream when no API key is provided', async () => {
    delete process.env.CHAINGPT_API_KEY;
    
    const response = await negotiateTrade('hello', { marketData: { tbillYield: 4.5, referencePrice: 100 } });
    
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('Content-Type')).toBe('text/plain');
    
    // Read the stream fully to cover controller.close()
    const reader = response.body?.getReader();
    let isDone = false;
    while (!isDone) {
      const { done, value } = await reader!.read();
      if (value) {
        expect(value).toBeDefined();
      }
      isDone = done;
    }
  });

  it('calls fetch when API key is provided', async () => {
    process.env.CHAINGPT_API_KEY = 'my_test_key';
    const mockResponse = { ok: true, status: 200, body: 'test' } as unknown as Response;
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

  it('uses mock stream when API response is not ok', async () => {
    process.env.CHAINGPT_API_KEY = 'my_test_key';
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });
    
    const response = await negotiateTrade('hello', { marketData: { tbillYield: 4.5, referencePrice: 100 } });
    
    expect(warnSpy).toHaveBeenCalledWith('ChainGPT API failed with status:', 500);
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('Content-Type')).toBe('text/plain');
    
    warnSpy.mockRestore();
  });

  it('uses mock stream when fetch throws an exception', async () => {
    process.env.CHAINGPT_API_KEY = 'my_test_key';
    const errSpy = jest.spyOn(console, 'error').mockImplementation();
    global.fetch = jest.fn().mockRejectedValue(new Error('Network failure'));
    
    const response = await negotiateTrade('hello', { marketData: { tbillYield: 4.5, referencePrice: 100 } });
    
    expect(errSpy).toHaveBeenCalledWith('ChainGPT fetch exception:', expect.any(Error));
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('Content-Type')).toBe('text/plain');
    
    errSpy.mockRestore();
  });
});
