import { it, describe } from 'vitest';

import { Queue } from '../src/main';

const CORRECT = Symbol('Expected');

describe('read-and-write-order', () => {
  it('Read after write', async ({ expect }) => {
    const Q = new Queue<Symbol>(5);
    expect(await Q.write(CORRECT)).to.equal(undefined);
    expect(await Q.read()).to.equal(CORRECT);
  });

  it('Write after read', async ({ expect }) => {
    const Q = new Queue<Symbol>(5);
    const readProm = Q.read();
    expect(await Q.write(CORRECT)).to.equal(undefined);
    expect(await readProm).to.equal(CORRECT);
  });

  it('should throw if multiple read at the same time', async ({ expect }) => {
    const Q = new Queue<Symbol>(5);
    Q.read();
    try {
      await Q.read();
      expect.fail();
    } catch {}
  });

  it('should be ok if multiple write at the same time', async ({ expect }) => {
    const Q = new Queue<Symbol>(5);
    Q.write(CORRECT);
    await Q.write(CORRECT);
  });
});
