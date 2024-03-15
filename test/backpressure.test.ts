import { it, describe } from 'vitest';

import { Queue } from '../src/main';

const FIRST = Symbol('First');
const CORRECT = Symbol('Expected');

describe('backpressure', () => {
  it('should be used once queue is full', async ({ expect }) => {
    const Q = new Queue<Symbol>(1);
    const target = 1000;
    await Q.write(FIRST);

    for (let i = 0; i < target; i++) {
      Q.write(CORRECT);
    }

    expect(await Q.read()).to.equal(FIRST);
    for (let i = 0; i < target; i++) {
      expect(await Q.read()).to.equal(CORRECT);
    }
  });
});
