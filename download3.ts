import https from 'https';
import fs from 'fs';

const urls = [
  'https://selladm.com.br/wp-content/uploads/2023/06/Logo-Sell-Adm.png',
  'https://selladm.com.br/wp-content/uploads/2023/06/Logo-Sell-Adm-Cor.png',
  'https://selladm.com.br/wp-content/uploads/2023/06/Logo-Sell-Adm-Colorido.png',
  'https://selladm.com.br/wp-content/uploads/2023/06/logo.png',
  'https://selladm.com.br/wp-content/uploads/2023/06/logo-sell.png'
];

urls.forEach(url => {
  https.get(url, (res) => {
    if (res.statusCode === 200) {
      console.log('Found:', url);
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const base64 = buffer.toString('base64');
        fs.writeFileSync('logo_colored.txt', `data:${res.headers['content-type']};base64,${base64}`);
      });
    }
  });
});
