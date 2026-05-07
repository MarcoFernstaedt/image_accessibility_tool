import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const globalsCss = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
const layout = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8');
const describeImageRoute = readFileSync(new URL('../app/api/describe-image/route.ts', import.meta.url), 'utf8');

assert(
  !/--background:\s*#(?:fff|ffffff)\b/i.test(globalsCss),
  'Global background token must not be white.'
);

assert(
  /body\s*\{[\s\S]*background:[^;}]+/i.test(globalsCss) || /<body[\s\S]*className=\{`[^`]*\bbg-(?:slate|zinc|neutral|stone|gray|black)-/i.test(layout),
  'Body must define a non-white background so the page never flashes white.'
);

assert(
  /<main[^>]*className="[^"]*\bbg-(?:slate|zinc|neutral|stone|gray|black)-/i.test(readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8')),
  'Main app surface must include a dark or neutral non-white background class.'
);

assert(
  !/const\s+openai\s*=\s*new\s+OpenAI/.test(describeImageRoute),
  'OpenAI client must not be instantiated at module scope because Next build imports route modules without runtime secrets.'
);

console.log('visual contract passed');
