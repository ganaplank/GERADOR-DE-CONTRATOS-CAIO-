import * as XLSX from 'xlsx';
fetch('https://docs.google.com/spreadsheets/d/14oZl3VokWLf9nwi3VnFvZyGxyvGzJ61XWCzt8fY_Hh8/export?format=xlsx')
  .then(res => res.arrayBuffer())
  .then(buffer => {
    const wb = XLSX.read(buffer, { type: 'array' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { defval: "" });
    console.log(data.slice(0, 2));
  });
