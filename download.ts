import https from 'https';
import fs from 'fs';

https.get('https://selladm.com.br', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const match = data.match(/<img[^>]+src="([^">]+logo[^">]+)"/i);
    if (match) {
      console.log('Found logo URL:', match[1]);
      const logoUrl = match[1].startsWith('http') ? match[1] : `https://selladm.com.br${match[1]}`;
      https.get(logoUrl, (imgRes) => {
        const chunks: Buffer[] = [];
        imgRes.on('data', (chunk) => chunks.push(chunk));
        imgRes.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const base64 = buffer.toString('base64');
          fs.writeFileSync('logo_base64.txt', `data:${imgRes.headers['content-type']};base64,${base64}`);
          console.log('Saved to logo_base64.txt');
        });
      });
    } else {
      console.log('Logo not found');
    }
  });
});
