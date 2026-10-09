import fs from 'node:fs';
const svg = fs.readFileSync('public/images/header-decoration.svg', 'utf8');
const paths = [...svg.matchAll(/<path\s+d="([^"]+)"/g)].map(match => match[1]);
if (!paths.length) throw new Error('Original wave paths missing');
fs.writeFileSync('app/components/header-wave.tsx', `import type { CSSProperties } from "react";

// Original curves from the supplied Decoration.svg; independent, staggered motion.
const paths = ${JSON.stringify(paths)};

export function HeaderWave() {
  return <svg className="header-ocean-wave ambient-motion" viewBox="143 18 736 319" fill="none" aria-hidden="true">
    <g fill="#202124" opacity=".1">{paths.map((d, index) => <path key={index} d={d} style={{ "--wave-delay": \`\${index * -.28}s\` } as CSSProperties} />)}</g>
  </svg>;
}
`);
console.log(`Prepared ${paths.length} original wave curves.`);
