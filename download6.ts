import https from 'https';

const urls = [
  'https://selladm.com.br/wp-content/uploads/2023/06/simbolo.png',
  'https://selladm.com.br/wp-content/uploads/2023/06/Simbolo.png',
  'https://selladm.com.br/wp-content/uploads/2023/06/Simbolo-Sell.png',
  'https://selladm.com.br/wp-content/uploads/2023/06/simbolo-sell.png',
  'https://selladm.com.br/wp-content/uploads/2023/06/Icone-Sell-Adm.png',
  'https://selladm.com.br/wp-content/uploads/2023/06/icone-sell-adm.png'
];

urls.forEach(url => {
  https.get(url, (res) => {
    if (res.statusCode === 200) {
      console.log('Found:', url);
    }
  });
});
