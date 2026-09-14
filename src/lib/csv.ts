export function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const records: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    if (values.length === headers.length) {
      const record: Record<string, string> = {};
      headers.forEach((header, idx) => {
        record[header] = values[idx];
      });
      records.push(record);
    }
  }
  return records;
}

export function generateCSV(headers: string[], rows: (string | number)[][]): string {
  const headerLine = headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(',');
  const rowLines = rows.map(row =>
    row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
  );
  return [headerLine, ...rowLines].join('\n');
}

export function generateCsv(records: Record<string, any>[]): string {
  if (records.length === 0) return '';
  const headers = Object.keys(records[0]);
  const rows = records.map(r => headers.map(h => r[h] ?? ''));
  return generateCSV(headers, rows);
}
