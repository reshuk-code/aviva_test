import fs from 'node:fs';
const file='app/homepage.tsx';
let source=fs.readFileSync(file,'utf8');
for(const name of ['heroArtwork','serviceRing','servicesPrint','processPrintLeft','processPrintRight','whySpark','statsRing']) source=source.replace(`className={s.${name}}`,`className={\`${'${s.'+name+'}'} ambient-motion\`}`);
source=source.replace('aboutPrint} about-print','aboutPrint} about-print ambient-motion').replace('aboutScribble} about-scribble','aboutScribble} about-scribble ambient-motion');
fs.writeFileSync(file,source);
