import https from 'https';
import fs from 'fs';

https.get('https://selladm.com.br/wp-content/uploads/2023/06/Logo-Sell-Adm.png', (res) => {
  const chunks: Buffer[] = [];
  res.on('data', (chunk) => chunks.push(chunk));
  res.on('end', () => {
    const buffer = Buffer.concat(chunks);
    const base64 = buffer.toString('base64');
    const tsContent = `export const logoBase64 = 'data:image/png;base64,${base64}';\n`;
    fs.writeFileSync('src/utils/logoBase64.ts', tsContent);
    console.log('Saved to src/utils/logoBase64.ts');
  });
});
