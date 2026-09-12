export type CsvProfile = {
  rows: number;
  columns: number;
  duplicates: number;
  headers: string[];
};

export function normalizeWhitespace(input: string): string {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');
}

export function uniqueLines(input: string): string {
  const seen = new Set<string>();
  return input
    .split(/\r?\n/)
    .filter((line) => {
      if (seen.has(line)) return false;
      seen.add(line);
      return true;
    })
    .join('\n');
}

export function countWords(input: string): number {
  const value = input.trim();
  return value ? value.split(/\s+/).length : 0;
}

export function countNonemptyLines(input: string): number {
  return input.split(/\r?\n/).filter((line) => line.trim()).length;
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"') {
      if (quoted && next === '"') {
        cell += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      row.push(cell);
      cell = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(cell);
      if (row.some((value) => value !== '')) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  row.push(cell);
  if (row.some((value) => value !== '')) rows.push(row);
  return rows;
}

function csvEscape(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export function stringifyCsv(rows: string[][]): string {
  return rows.map((row) => row.map(csvEscape).join(',')).join('\n');
}

export function csvProfile(input: string): CsvProfile {
  const rows = parseCsv(input);
  if (!rows.length) return { rows: 0, columns: 0, duplicates: 0, headers: [] };
  const headers = rows[0];
  const data = rows.slice(1);
  const seen = new Set<string>();
  let duplicates = 0;
  for (const row of data) {
    const key = JSON.stringify(row);
    if (seen.has(key)) duplicates += 1;
    else seen.add(key);
  }
  return { rows: data.length, columns: headers.length, duplicates, headers };
}

export function csvDedupe(input: string): string {
  const rows = parseCsv(input);
  if (rows.length < 2) return input;
  const out = [rows[0]];
  const seen = new Set<string>();
  for (const row of rows.slice(1)) {
    const key = JSON.stringify(row);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(row);
    }
  }
  return stringifyCsv(out);
}

export function jsonPretty(input: string): string {
  return JSON.stringify(JSON.parse(input), null, 2);
}

export function jsonMinify(input: string): string {
  return JSON.stringify(JSON.parse(input));
}
