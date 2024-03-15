import { it, describe } from 'vitest';

import { Queue } from '../src/main';

const CORRECT = Symbol('Expected');

enum Next {
  Write = 'Write',
  Read = 'Read',
}

describe('throughput', () => {
  it('should flip flop from read to write with size 1', async ({ expect }) => {
    const Q = new Queue<Symbol>(1);
    let remainingWrite = 1000;
    let remainingRead = 1000;
    let next = Next.Write;

    await Promise.all([
      (async function W() {
        expect(next).to.equal(Next.Write);
        next = Next.Read;
        await Q.write(CORRECT);
        remainingWrite -= 1;
        if (remainingWrite > 0) {
          return W();
        }
      })(),
      (async function R() {
        expect(next).to.equal(Next.Read);
        next = Next.Write;
        expect(await Q.read()).to.equal(CORRECT);
        remainingRead -= 1;
        if (remainingRead > 0) {
          return R();
        }
      })(),
    ]);

    expect(remainingWrite).to.equal(0);
    expect(remainingRead).to.equal(0);
  });

  it('should be able to run all write before any read with large size', async ({ expect }) => {
    const Q = new Queue<Symbol>(2**20);
    const target = 1000;

    for (let i = 0; i < target; i++) {
      await Q.write(CORRECT);
    }

    for (let i = 0; i < target; i++) {
      expect(await Q.read()).to.equal(CORRECT);
    }
  });
});
