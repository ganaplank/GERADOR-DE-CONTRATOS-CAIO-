fetch('https://docs.google.com/spreadsheets/d/14oZl3VokWLf9nwi3VnFvZyGxyvGzJ61XWCzt8fY_Hh8/export?format=xlsx')
  .then(res => {
    console.log('Status:', res.status);
    console.log('CORS headers:', res.headers.get('access-control-allow-origin'));
  });
