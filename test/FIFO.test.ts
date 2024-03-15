import { it, describe } from 'vitest';

import { Queue } from '../src/main';


describe('FIFO', () => {
  it('queue should be first-in-first-out', async ({ expect }) => {
    const Q = new Queue<number>(2**20);
    const target = 1000;

    for (let i = 0; i < target; i++) {
      await Q.write(i);
    }

    for (let i = 0; i < target; i++) {
      expect(await Q.read()).to.equal(i);
    }
  });
});
