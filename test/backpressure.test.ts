import { it, describe } from 'vitest';

import { Queue } from '../src/main';

const CORRECT = Symbol('Expected');

describe('backpressure', () => {
  it('should be used once queue is full', async ({ expect }) => {
    const Q = new Queue<Symbol>(1000);

    for (let i = 0; i < Q.capacity() * 2; i++) {
      Q.write(CORRECT);
    }

    while (Q.pressure() > 0) {
      expect(await Q.read()).to.equal(CORRECT);
    }
  });

  it('should queue backpressure as microtask by default', async ({ expect }) => {
    const Q = new Queue<Symbol>(1);

    Q.write(CORRECT);
    Q.write(CORRECT);

    // Within capacity
    expect(await Q.read()).to.equal(CORRECT);

    // Backpressure
    expect(await Q.read()).to.equal(CORRECT);
  });
});
