import sharp from 'sharp';
const generated = 'C:/Users/Reshuk/.codex/generated_images/01a11f0a-fa2e-7572-a9db-b96e6c007f37';
await sharp(`${generated}/exec-b96174c7-0e90-48f1-af50-46f3be7918fe.png`).resize({width:900}).webp({quality:90}).toFile('public/images/why-aviva-portrait.webp');
await sharp(`${generated}/exec-dcd23e67-2528-4a23-8531-99e2acd842a8.png`).resize({width:1800}).webp({quality:88}).toFile('public/images/creative-studio-v2.webp');
console.log('Prepared optimized homepage photos.');
