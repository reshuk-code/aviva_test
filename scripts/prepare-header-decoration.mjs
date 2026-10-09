import fs from 'node:fs/promises';
const input=await fs.readFile('public/reference/aviva/Decoration.svg','utf8');
const output=input.replace('width="969" height="690" viewBox="0 0 969 690"','width="736" height="319" viewBox="143 18 736 319"');
await fs.writeFile('public/images/header-decoration.svg',output);
