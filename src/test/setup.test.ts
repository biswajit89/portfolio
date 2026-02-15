import { describe, it, expect } from 'vitest';

describe('Project setup', () => {
  it('vitest runs correctly', () => {
    expect(1 + 1).toBe(2);
  });

  it('can import core dependencies', async () => {
    const zustand = await import('zustand');
    expect(zustand.create).toBeDefined();

    const framerMotion = await import('framer-motion');
    expect(framerMotion.motion).toBeDefined();

    const reactRouter = await import('react-router-dom');
    expect(reactRouter.BrowserRouter).toBeDefined();
  });
});
