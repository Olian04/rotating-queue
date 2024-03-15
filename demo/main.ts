import { Queue } from '../dist/main';

const A = new Queue<number>(5);
const B = new Queue<number>(5);
const C = new Queue<number>(5);

// Part of bridge
const route = async (item: any) => {
  await B.write(item);
  await C.write(item);
}

const loloNode = async <T>(queue: Queue<T>, { handler }: { handler: (ev: any, ctx: any) => void}) => {
  while (true) {
    const item = await queue.read();
    await handler(item, { route });
  }

}

Promise.all([
  loloNode(A, {
    handler: (ev: any, ctx: { route: (ev: any) => Promise<void> }) => ctx.route(ev),
  }),
  loloNode(B, {
    handler: (ev: any) => console.log(ev),
  }),
  loloNode(C, {
    handler: (ev: any) => console.log(ev),
  }),
]);

for (let i = 0; i < 10; i++) {
  A.write(i + 1);
}
