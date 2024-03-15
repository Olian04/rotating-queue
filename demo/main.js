const { Queue } = require("../dist/main");

const A = new Queue(5);
const B = new Queue(5);
const C = new Queue(5);

// Part of bridge
const route = async (item) => {
  await B.write(item);
  await C.write(item);
};

const loloNode = async (queue, { handler }) => {
  while (true) {
    const item = await queue.read();
    await handler(item, { route });
  }
};

Promise.all([
  loloNode(A, {
    handler: (ev, ctx) => ctx.route(ev),
  }),
  loloNode(B, {
    handler: (ev) => console.log(ev),
  }),
  loloNode(C, {
    handler: (ev) => console.log(ev),
  }),
]);

for (let i = 0; i < 10; i++) {
  A.write(i + 1);
}
