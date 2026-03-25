import sharp from 'sharp';
import fs from 'fs';

const base64Data = fs.readFileSync('src/utils/logoBase64.ts', 'utf8').match(/data:image\/png;base64,(.*)'/)[1];
const buffer = Buffer.from(base64Data, 'base64');

sharp(buffer)
  .extract({ left: 0, top: 0, width: 100, height: 100 }) // Adjust width/height based on the actual logo dimensions
  .toBuffer()
  .then(data => {
    const base64 = data.toString('base64');
    const tsContent = `export const iconBase64 = 'data:image/png;base64,${base64}';\n`;
    fs.appendFileSync('src/utils/logoBase64.ts', tsContent);
    console.log('Saved iconBase64 to src/utils/logoBase64.ts');
  })
  .catch(err => {
    console.error(err);
  });
