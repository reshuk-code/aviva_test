import fs from 'node:fs';
const file = 'app/homepage.tsx';
let source = fs.readFileSync(file, 'utf8');
source = source.replace('import { HeaderWave }', 'import { CountUp } from "./components/count-up";\nimport { HeaderWave }');
source = source.replace('<strong>17</strong>', '<CountUp value={17} />');
source = source.replace('<dt>{stat.value}</dt>', '<CountUp as="dt" value={parseInt(stat.value, 10)} suffix="+" />');
fs.writeFileSync(file, source);
