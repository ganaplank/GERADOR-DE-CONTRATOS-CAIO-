import https from 'https';
import fs from 'fs';

const urls = [
  'https://selladm.com.br/wp-content/uploads/2023/06/Icone.png',
  'https://selladm.com.br/wp-content/uploads/2023/06/Icone-Sell.png',
  'https://selladm.com.br/wp-content/uploads/2023/06/icone.png',
  'https://selladm.com.br/wp-content/uploads/2023/06/favicon.png',
  'https://selladm.com.br/wp-content/uploads/2023/06/favicon.ico'
];

urls.forEach(url => {
  https.get(url, (res) => {
    if (res.statusCode === 200) {
      console.log('Found:', url);
    }
  });
});
