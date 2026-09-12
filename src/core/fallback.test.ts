import { describe, expect, it } from 'vitest';
import { csvDedupe, csvProfile, normalizeWhitespace, uniqueLines } from './fallback';

describe('fallback engine', () => {
  it('normalizes whitespace', () => expect(normalizeWhitespace(' a  \n\n b ')).toBe('a\nb'));
  it('removes duplicate lines', () => expect(uniqueLines('a\na\nb')).toBe('a\nb'));
  it('profiles CSV', () => expect(csvProfile('a,b\n1,2\n1,2\n3,4')).toMatchObject({ rows: 3, columns: 2, duplicates: 1 }));
  it('dedupes CSV', () => expect(csvDedupe('a,b\n1,2\n1,2\n3,4')).toBe('a,b\n1,2\n3,4'));
});
