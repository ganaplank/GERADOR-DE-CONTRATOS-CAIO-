import https from 'https';
import fs from 'fs';

https.get('https://selladm.com.br', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const matches = [...data.matchAll(/<img[^>]+src="([^">]+)"/gi)];
    matches.forEach(match => {
      console.log('Found image:', match[1]);
    });
  });
});
