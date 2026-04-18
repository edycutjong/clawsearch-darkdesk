import '@testing-library/jest-dom';
import React from 'react';
import { TextEncoder, TextDecoder } from 'util';
import { ReadableStream } from 'node:stream/web';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;

if (typeof global.Request === 'undefined') {
  global.Request = class Request {} as unknown as typeof global.Request;
}
if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    body: unknown;
    headers: Map<string, string>;
    status: number;
    constructor(body: unknown, init?: { status?: number }) {
      this.body = body;
      this.headers = new Map([['Content-Type', 'text/plain']]);
      this.status = init?.status || 200;
    }
  } as unknown as typeof global.Response;
}

if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = ReadableStream as unknown as typeof global.ReadableStream;
}


// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock framer-motion to avoid animation issues in jsdom
jest.mock('framer-motion', () => {
  const MotionDiv = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
    const { children, ...rest } = props;
    const filteredProps = { ...rest } as Record<string, unknown>;
    ['custom', 'variants', 'initial', 'animate', 'exit', 'transition', 'whileHover', 'whileTap', 'layoutId', 'layout', 'style'].forEach(prop => delete filteredProps[prop]);
    return React.createElement('div', { ref, ...filteredProps }, children);
  });
  MotionDiv.displayName = 'MotionDiv';

  const MotionSpan = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>((props, ref) => {
    return React.createElement('span', { ref, ...props }, props.children);
  });
  MotionSpan.displayName = 'MotionSpan';

  const AnimatePresence = ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children);
  AnimatePresence.displayName = 'AnimatePresence';

  return {
    motion: {
      div: MotionDiv,
      span: MotionSpan,
    },
    AnimatePresence,
  };
});

// Override console error globally to ignore known warnings if needed, but not doing it aggressively here.
