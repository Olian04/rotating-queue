import { it, describe } from 'vitest';

import { Queue } from '../src/main';

const CORRECT = Symbol('Expected');

describe('capacity', () => {
  it('should be equal to defined capacity for empty queue', async ({ expect }) => {
    const capacity = 5;
    const Q = new Queue<Symbol>(capacity);
    expect(Q.capacity()).to.equal(capacity);
  });

  it('should remain the same when written to', async ({ expect }) => {
    const capacity = 5;
    const Q = new Queue<Symbol>(capacity);
    expect(Q.capacity()).to.equal(capacity);
    await Q.write(CORRECT);
    expect(Q.capacity()).to.equal(capacity);
    await Q.write(CORRECT);
    expect(Q.capacity()).to.equal(capacity);
    await Q.write(CORRECT);
    expect(Q.capacity()).to.equal(capacity);
  });

  it('should remain the same when read from', async ({ expect }) => {
    const capacity = 5;
    const Q = new Queue<Symbol>(capacity);
    await Q.write(CORRECT);
    await Q.write(CORRECT);
    await Q.write(CORRECT);
    expect(Q.capacity()).to.equal(capacity);
    await Q.read();
    expect(Q.capacity()).to.equal(capacity);
    await Q.read();
    expect(Q.capacity()).to.equal(capacity);
    await Q.read();
    expect(Q.capacity()).to.equal(capacity);
  });
});
