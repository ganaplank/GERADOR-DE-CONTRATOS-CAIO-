import * as XLSX from 'xlsx';
import * as fs from 'fs';

try {
    const fileBuffer = fs.readFileSync('./public/condominios.xlsx');
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    if (data.length > 0) {
        console.log('Headers:', Object.keys(data[0] as object));
        console.log('First row:', data[0]);
    } else {
        console.log('Sheet is empty');
    }
} catch (e) {
    console.error('Error reading file:', e);
}
