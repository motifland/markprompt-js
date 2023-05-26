import * as esbuild from 'esbuild';

import { config } from './config';

const ctx = await esbuild.context({
  ...config,
  jsxDev: true,
  minify: false,
});

await ctx.watch();