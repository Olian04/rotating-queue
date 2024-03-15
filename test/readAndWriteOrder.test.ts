import { it, describe } from 'vitest';

import { Queue } from '../src/main';

const CORRECT = Symbol('Expected');

describe('Read-Write', () => {
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
});
