import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const source = path.join(root, 'public/reference');
const output = path.join(root, 'public/images');
const qa = path.join(root, '.visual-qa');
await fs.mkdir(output, { recursive: true });
await fs.mkdir(qa, { recursive: true });
const files = (await fs.readdir(source)).filter((file) => file.endsWith('.svg'));
const tiles = [];
for (const [index, file] of files.entries()) {
  const slug = file.replace(/\.svg$/, '').replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
  const svg = await fs.readFile(path.join(source, file));
  await sharp(svg).webp({ quality: 90 }).toFile(path.join(output, `${slug}.webp`));
  const thumbnail = await sharp(svg).resize(210, 160, { fit: 'contain', background: '#191919' }).png().toBuffer();
  const label = Buffer.from(`<svg width="230" height="32"><text x="10" y="22" font-size="15" fill="white">${file.replace(/&/g, '&amp;')}</text></svg>`);
  const tile = await sharp({ create: { width: 230, height: 200, channels: 4, background: '#191919' } }).composite([{ input: thumbnail, left: 10, top: 4 }, { input: label, left: 0, top: 166 }]).png().toBuffer();
  tiles.push({ input: tile, left: (index % 6) * 240, top: Math.floor(index / 6) * 210 });
}
await sharp({ create: { width: 1440, height: Math.ceil(files.length / 6) * 210, channels: 4, background: '#0f0f0f' } }).composite(tiles).png().toFile(path.join(qa, 'assets.png'));
const reference = path.join(root, 'Layout.png');
await sharp(reference).extract({ left: 250, top: 290, width: 1920, height: 11117 }).resize({ width: 960 }).png().toFile(path.join(qa, 'reference-page.png'));
for (const [name, top, height] of [['hero', 290, 1700], ['intro', 2100, 2300], ['projects', 4300, 2500], ['lower', 7000, 2800], ['footer', 9800, 1607]]) {
  await sharp(reference).extract({ left: 250, top, width: 1920, height }).resize({ width: 1200 }).png().toFile(path.join(qa, `reference-${name}.png`));
}
console.log(`Prepared ${files.length} local assets and reference crops.`);
