# Toolbox Web

Tarayıcıda çalışan, local-first veri / dosya / developer araç kutusu. İlk sürüm mümkün olan işlemleri cihaz üzerinde yapar; sunucu zorunlu değildir.

## v0.1.0 çalışan araçlar

- CSV analiz, önizleme, duplicate tespiti ve temizleme
- JSON format / minify / validate
- Metin temizleme ve satır işlemleri
- Metin workflow/pipeline builder
- SHA-256 dosya hash
- Görsel resize + PNG/JPEG/WebP dönüşümü
- Base64 encode/decode
- URL encode/decode
- UUID v4 generator
- Regex tester
- Unix timestamp converter
- Satır bazlı metin karşılaştırma
- Drag & drop dosya yönlendirme
- Komut çubuğu (Ctrl/Cmd + K)
- PWA/offline cache
- Opsiyonel Rust/WebAssembly motoru

## Çalıştırma

### En kolay
`index.html` dosyasını tarayıcıda açın. Çoğu araç doğrudan çalışır.

### Önerilen
```bash
python -m http.server 8080
```
Ardından `http://localhost:8080`.

## Rust/WASM

Rust çekirdeği `rust-core/` altındadır. Yerelde Rust + wasm-pack varsa:

```bash
wasm-pack build rust-core --target web --out-dir ../wasm-pkg
```

Site, `wasm-pkg` bulunduğunda Rust/WASM motorunu otomatik algılar; bulunamazsa JavaScript fallback ile çalışır.

## GitHub Pages

`.github/workflows/pages.yml` main branch push'unda Rust/WASM derler ve GitHub Pages artifact'ı üretir. Repo ayarlarında Pages kaynağını **GitHub Actions** olarak seçmek yeterlidir.

## Mimari yön

v0.2: XLSX + daha güçlü tablo profilleme + işlem geçmişi  
v0.3: DuckDB-WASM / Parquet / SQL workspace  
v0.4: görsel workflow ve batch processing  
v0.5: AI komut katmanı ve kayıtlı workflow şablonları

## Gizlilik

Local-first araçlarda dosya içeriği tarayıcıda işlenir. Gelecekte sunucu/AI gerektiren özellikler ayrı ve açık biçimde etiketlenecektir.
