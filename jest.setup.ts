import '@testing-library/jest-dom';

// Polyfill Fetch API for Next.js 16 tests
// @ts-expect-error Polyfill for jsdom environment
global.Headers = class Headers {
  _map: Map<string, string>;
  constructor(init?: HeadersInit | Record<string, string>) {
    this._map = new Map();
    if (init) {
      if (init instanceof Headers || ('_map' in init && init._map)) {
        const source = ('_map' in init ? init._map : init) as Map<string, string>;
        source.forEach((v: string, k: string) => this._map.set(k.toLowerCase(), v));
      } else if (Array.isArray(init)) {
        init.forEach(([k, v]) => this._map.set(k.toLowerCase(), String(v)));
      } else {
        Object.entries(init).forEach(([k, v]) => {
          this._map.set(k.toLowerCase(), String(v));
        });
      }
    }
  }
  get(name: string) { return this._map.get(name.toLowerCase()) || null; }
  has(name: string) { return this._map.has(name.toLowerCase()); }
  forEach(cb: (value: string, key: string, parent: Headers) => void) { this._map.forEach((v, k) => cb(v, k, this as unknown as Headers)); }
  getSetCookie() { return []; }
  append(name: string, value: string) { this._map.set(name.toLowerCase(), value); }
  entries() { return this._map.entries(); }
  keys() { return this._map.keys(); }
  values() { return this._map.values(); }
  [Symbol.iterator]() { return this._map.entries(); }
};

// @ts-expect-error Polyfill for jsdom environment
global.Request = class Request {
  _url: string;
  _method: string;
  _body: string | null;
  _headers: Headers;
  constructor(url: string, init?: RequestInit & { _map?: Map<string, string> }) {
    this._url = url;
    this._method = init?.method || 'GET';
    this._body = init?.body ? String(init.body) : null;
    this._headers = new global.Headers(init?.headers);
  }
  get url() { return this._url; }
  get method() { return this._method; }
  get headers() { return this._headers; }
  async json() {
    return JSON.parse(this._body || '{}');
  }
};

// @ts-expect-error Polyfill for jsdom environment
global.Response = class Response {
  _body: unknown;
  _init: ResponseInit;
  _headers: Headers;
  constructor(body?: unknown, init?: ResponseInit) {
    this._body = body;
    this._init = init || {};
    this._headers = new global.Headers(this._init.headers);
  }
  get status() { return this._init.status || 200; }
  get headers() { return this._headers; }
  async json() {
    return typeof this._body === 'string' ? JSON.parse(this._body) : this._body;
  }
  static json(data: unknown, init?: ResponseInit) {
    return new Response(JSON.stringify(data), init);
  }
};

// Global mocks
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.IntersectionObserver = class IntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
};

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    };
  },
  useParams() {
    return {};
  },
  usePathname() {
    return '/';
  },
}));

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}
// Polyfill scrollIntoView for JSDOM
if (typeof window !== "undefined") {
  window.Element.prototype.scrollIntoView = jest.fn();
}
