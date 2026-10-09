import fs from 'node:fs/promises';
import sharp from 'sharp';
const root='public/reference/aviva';
const office=await fs.readFile(`${root}/Rectangle 21022.svg`,'utf8');
const embedded=office.match(/data:image\/[^;]+;base64,([^"']+)/);
if(!embedded) throw new Error('Office photo missing from source SVG');
await sharp(Buffer.from(embedded[1],'base64')).resize({width:1800,withoutEnlargement:true}).webp({quality:88}).toFile('public/images/aviva-office.webp');
await sharp(`${root}/image 215.svg`,{density:160}).resize({width:900}).webp({quality:90}).toFile('public/images/aviva-portrait.webp');
console.log('Prepared original office and portrait assets.');
