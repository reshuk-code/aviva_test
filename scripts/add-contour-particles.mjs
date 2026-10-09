import fs from 'node:fs';
const file = 'app/homepage.tsx';
let source = fs.readFileSync(file, 'utf8');
source = source.replace('import { HeaderWave }', 'import { ContourParticles } from "./components/contour-particles";\nimport { HeaderWave }');
for (const name of ['serviceRing', 'servicesPrint', 'processPrintLeft', 'processPrintRight', 'statsRing', 'aboutPrint']) {
 const shape = ['servicesPrint', 'processPrintRight', 'aboutPrint'].includes(name) ? 'terrain' : 'ring';
 const pattern = new RegExp('<span className=\\{`\\$\\{s\\.' + name + '\\}[^`]*`\\} aria-hidden="true" />');
 if (!pattern.test(source)) throw new Error(`Missing decoration ${name}`);
 source = source.replace(pattern, `<ContourParticles className={s.${name}} shape="${shape}" />`);
}
fs.writeFileSync(file, source);
