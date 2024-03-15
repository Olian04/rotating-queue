import { it, describe } from 'vitest';

import { Queue } from '../src/main';

const CORRECT = Symbol('Expected');

describe('createQueue', () => {
  it('should thrown when created with an invalid size', async ({ expect }) => {
    try {
      const Q = new Queue<Symbol>(-1);
      expect.fail();
    } catch {}

    try {
      const Q = new Queue<Symbol>(1.1);
      expect.fail();
    } catch {}
  });

  it('should be functional with size 1', async ({ expect }) => {
    const Q = new Queue<Symbol>(1);
    expect(await Q.write(CORRECT)).to.equal(undefined);
    expect(await Q.read()).to.equal(CORRECT);
  });

  it('should be functional with very large size', async ({ expect }) => {
    const Q = new Queue<Symbol>(2**20);
    const readProm = Q.read();
    expect(await Q.write(CORRECT)).to.equal(undefined);
    expect(await readProm).to.equal(CORRECT);
  });
});
