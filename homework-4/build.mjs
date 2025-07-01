import { build } from 'esbuild';
import { rmSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('dist');
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

await build({
    entryPoints : ['src/server.js'],
    bundle      : true,
    format      : 'esm',
    platform    : 'node',
    target      : 'node20',
    outfile     : path.join(outDir, 'server.mjs'),
    minifySyntax: true,
    minifyWhitespace: true,
    minifyIdentifiers: false,
    treeShaking : true,
    legalComments: 'none',
});

console.log('✅ ESM bundle → dist/server.mjs');