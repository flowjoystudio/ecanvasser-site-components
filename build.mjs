// Builds dist/ from src/. Run: npm run build
import { build, transform } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from 'node:fs';

const out = 'dist';
rmSync(out, { recursive: true, force: true });
mkdirSync(`${out}/img`, { recursive: true });

// trial-demo: inline the markup into the script, then minify JS and CSS
const markup = readFileSync('src/trial-demo/markup.html', 'utf8');
const src = readFileSync('src/trial-demo/demo.src.js', 'utf8').replace('__MARKUP__', () => JSON.stringify(markup));
const js = await transform(src, { minify: true, target: 'es2017', legalComments: 'inline' });
writeFileSync(`${out}/trial-demo.js`, js.code);
const css = await transform(readFileSync('src/trial-demo/demo.css', 'utf8'), { loader: 'css', minify: true });
writeFileSync(`${out}/trial-demo.css`, css.code);
cpSync('src/trial-demo/img', `${out}/img`, { recursive: true });

const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1) + 'KB';
console.log('dist/trial-demo.js ', kb(js.code));
console.log('dist/trial-demo.css', kb(css.code));
