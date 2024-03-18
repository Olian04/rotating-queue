import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: "./src/main.ts",
    output: [
      {
        file: "./dist/main.js",
        format: "commonjs",
        sourcemap: true,
      },
    ],
    treeshake: true,
    plugins: [
      typescript({
        module: "es6",
      }),
      commonjs(),
      terser({
        sourceMap: true,
        compress: {
          unsafe_methods: true,
        },
        mangle: {
          keep_classnames: true,
        },
      }),
    ],
  },
];
