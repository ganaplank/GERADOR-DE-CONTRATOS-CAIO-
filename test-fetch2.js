fetch('https://docs.google.com/spreadsheets/d/14oZl3VokWLf9nwi3VnFvZyGxyvGzJ61XWCzt8fY_Hh8/gviz/tq?tqx=out:csv')
  .then(res => res.text())
  .then(text => console.log(text.substring(0, 500)));
