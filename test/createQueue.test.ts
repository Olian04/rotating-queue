import { it, describe } from 'vitest';

import { Queue } from '../src/main';

const CORRECT = Symbol('Expected');

describe('new-queue', () => {
  it('should thrown when passed zero size', async ({ expect }) => {
    try {
      const Q = new Queue<Symbol>(0);
      expect.fail();
    } catch {}
  });


  it('should thrown when passed negative size', async ({ expect }) => {
    try {
      const Q = new Queue<Symbol>(-1);
      expect.fail();
    } catch {}
  });

  it('should thrown when passed float size', async ({ expect }) => {
    try {
      const Q = new Queue<Symbol>(1.1);
      expect.fail();
    } catch {}
  });

  it('should be ok with size 1', async ({ expect }) => {
    const Q = new Queue<Symbol>(1);
    expect(await Q.write(CORRECT)).to.equal(undefined);
    expect(await Q.read()).to.equal(CORRECT);
  });

  it('should be ok with very large size', async ({ expect }) => {
    const Q = new Queue<Symbol>(2**20);
    const readProm = Q.read();
    expect(await Q.write(CORRECT)).to.equal(undefined);
    expect(await readProm).to.equal(CORRECT);
  });
});
