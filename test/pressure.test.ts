import { it, describe } from 'vitest';

import { Queue } from '../src/main';

const CAPACITY = 10;

describe('pressure', () => {
  it('should be zero when empty', async ({ expect }) => {
    const Q = new Queue<Symbol>(CAPACITY);
    expect(Q.pressure()).to.equal(0);
  });

  it('should be one when at capacity', async ({ expect }) => {
    const Q = new Queue<number>(CAPACITY);
    for (let i = 0; i < Q.capacity(); i++) {
      Q.write(i);
    }
    expect(Q.pressure()).to.equal(1);
  });

  it('should be one half when at half capacity', async ({ expect }) => {
    const Q = new Queue<number>(CAPACITY);
    for (let i = 0; i < Q.capacity() / 2; i++) {
      Q.write(i);
    }
    expect(Q.pressure()).to.equal(0.5);
  });

  it('should be two when at double the capacity', async ({ expect }) => {
    const Q = new Queue<number>(CAPACITY);
    for (let i = 0; i < Q.capacity() * 2; i++) {
      Q.write(i);
    }
    expect(Q.pressure()).to.equal(2);
  });
});
