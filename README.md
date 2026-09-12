# Toolbox Web 🦀

Tarayıcıda çalışan **local-first** veri / dosya / developer araç kutusu. Arayüz Vite + TypeScript, ağır işlemler Rust → WebAssembly çekirdeğiyle çalışır. WASM yüklenemezse uygulama TypeScript fallback ile kullanılmaya devam eder.

## v0.2.0

- Gerçek Vite + TypeScript uygulama yapısı
- Rust/WebAssembly çekirdeği
- CSV profil + duplicate temizleme (Rust)
- JSON pretty/minify (Rust)
- Metin normalize / unique / sayaçlar (Rust)
- SHA-256 dosya hash (Rust)
- Workflow engine
- Base64, URL, UUID, Regex, Timestamp araçları
- Drag & drop dosya yönlendirme
- Local-first çalışma
- GitHub Pages CI/CD
- Fallback motoru için otomatik testler

## Yerelde çalıştır

```bash
npm install
npm run dev
```

Rust/WASM'i de yerelde etkinleştirmek için:

```bash
wasm-pack build rust-core --target web --out-dir ../wasm-pkg --release
npm run dev
```

> Rust/WASM paketi yoksa uygulama otomatik olarak TypeScript fallback kullanır.

## Production build

```bash
npm install
npm test
npm run build
```

GitHub Actions, production sırasında Rust çekirdeğini de derleyip `dist/wasm-pkg` altına ekler.

## Yol haritası

- v0.3 — XLSX/çoklu Excel, tablo profilleme, işlem geçmişi
- v0.4 — DuckDB-WASM, Parquet ve SQL workspace
- v0.5 — görsel workflow/batch processing
- v0.6 — AI komut katmanı + kayıtlı workflow şablonları
