import sharp from 'sharp';
import fs from 'fs';

const base64Data = fs.readFileSync('src/utils/logoBase64.ts', 'utf8').match(/data:image\/png;base64,(.*)'/)[1];
const buffer = Buffer.from(base64Data, 'base64');

sharp(buffer)
  .metadata()
  .then(metadata => {
    console.log('Width:', metadata.width);
    console.log('Height:', metadata.height);
  });
