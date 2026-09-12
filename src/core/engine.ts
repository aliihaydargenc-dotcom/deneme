import * as fallback from './fallback';
import type { CsvProfile } from './fallback';

type WasmModule = {
  default: () => Promise<unknown>;
  engine_version: () => string;
  normalize_whitespace: (input: string) => string;
  unique_lines: (input: string) => string;
  count_words: (input: string) => number;
  count_nonempty_lines: (input: string) => number;
  csv_profile: (input: string) => string;
  csv_dedupe: (input: string) => string;
  json_pretty: (input: string) => string;
  json_minify: (input: string) => string;
  sha256_hex: (input: Uint8Array) => string;
};

let wasm: WasmModule | null = null;
let mode = 'TypeScript fallback';

export async function initEngine(): Promise<string> {
  try {
    const wasmUrl = new URL('wasm-pkg/toolbox_core.js', document.baseURI).href;
    const module = (await import(/* @vite-ignore */ wasmUrl)) as WasmModule;
    await module.default();
    wasm = module;
    mode = `Rust/WASM ${module.engine_version()}`;
  } catch (error) {
    console.info('Rust/WASM paketi bulunamadı; TypeScript fallback aktif.', error);
  }
  return mode;
}

export function engineMode(): string {
  return mode;
}

export const engine = {
  normalizeWhitespace(input: string): string {
    return wasm ? wasm.normalize_whitespace(input) : fallback.normalizeWhitespace(input);
  },
  uniqueLines(input: string): string {
    return wasm ? wasm.unique_lines(input) : fallback.uniqueLines(input);
  },
  countWords(input: string): number {
    return wasm ? wasm.count_words(input) : fallback.countWords(input);
  },
  countNonemptyLines(input: string): number {
    return wasm ? wasm.count_nonempty_lines(input) : fallback.countNonemptyLines(input);
  },
  csvProfile(input: string): CsvProfile {
    return wasm ? (JSON.parse(wasm.csv_profile(input)) as CsvProfile) : fallback.csvProfile(input);
  },
  csvDedupe(input: string): string {
    return wasm ? wasm.csv_dedupe(input) : fallback.csvDedupe(input);
  },
  jsonPretty(input: string): string {
    return wasm ? wasm.json_pretty(input) : fallback.jsonPretty(input);
  },
  jsonMinify(input: string): string {
    return wasm ? wasm.json_minify(input) : fallback.jsonMinify(input);
  },
  async sha256Hex(input: Uint8Array): Promise<string> {
    if (wasm) return wasm.sha256_hex(input);
    const copy = new Uint8Array(input.byteLength);
    copy.set(input);
    const digest = await crypto.subtle.digest('SHA-256', copy.buffer);
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  },
};
