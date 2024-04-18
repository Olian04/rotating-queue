import { it, describe } from 'vitest';

import { Queue } from '../src/main';

const capacity = 10;

describe('pressure', () => {
  it('should be 0 when empty', async ({ expect }) => {
    const Q = new Queue<Symbol>(capacity);
    expect(Q.pressure()).to.equal(0);
  });

  it('should be 1 when at capacity', async ({ expect }) => {
    const Q = new Queue<number>(capacity);
    for (let i = 0; i < Q.capacity(); i++) {
      Q.write(i);
    }
    expect(Q.pressure()).to.equal(1);
  });

  it('should be 0.5 when at half capacity', async ({ expect }) => {
    const Q = new Queue<number>(capacity);
    for (let i = 0; i < Q.capacity() / 2; i++) {
      Q.write(i);
    }
    expect(Q.pressure()).to.equal(0.5);
  });

  it('should be 2 when at double the capacity', async ({ expect }) => {
    const Q = new Queue<number>(capacity);
    for (let i = 0; i < Q.capacity() * 2; i++) {
      Q.write(i);
    }
    expect(Q.pressure()).to.equal(2);
  });
});
