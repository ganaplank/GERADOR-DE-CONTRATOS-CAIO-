import sharp from 'sharp';
import fs from 'fs';

const base64Data = fs.readFileSync('src/utils/logoBase64.ts', 'utf8').match(/data:image\/png;base64,(.*)'/)[1];
const buffer = Buffer.from(base64Data, 'base64');

sharp(buffer)
  .extract({ left: 0, top: 0, width: 170, height: 170 })
  .toBuffer()
  .then(data => {
    const base64 = data.toString('base64');
    const tsContent = `export const iconBase64 = 'data:image/png;base64,${base64}';\n`;
    fs.writeFileSync('src/utils/iconBase64.ts', tsContent);
    console.log('Saved iconBase64 to src/utils/iconBase64.ts');
  })
  .catch(err => {
    console.error(err);
  });
