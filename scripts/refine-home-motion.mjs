import fs from 'node:fs';
const file='app/homepage.tsx';
let s=fs.readFileSync(file,'utf8');
s=s.replace('import { HeaderWave }','import { OrbitDecoration } from "./components/orbit-decoration";\nimport { HeaderWave }');
s=s.replace('<span className={`${s.aboutScribble} about-scribble ambient-motion`} aria-hidden="true" />','<OrbitDecoration className={s.aboutScribble} />');
s=s.replace('<span className={`${s.whySpark} ambient-motion`} aria-hidden="true" />','<OrbitDecoration className={s.whySpark} mirrored />');
for(const name of ['outlineStar','goldStar','heroDashes']) s=s.replace(`className={s.${name}}`, `className={\`\${s.${name}} ambient-motion\`}`);
fs.writeFileSync(file,s);
