# Architecture

```text
Browser UI (Vite + TypeScript)
        |
        +-- Engine Adapter ----------------------+
        |                                       |
        v                                       v
Rust/WebAssembly core                    TypeScript fallback
CSV / JSON / text / hash                 Same core UX if WASM unavailable
        |
        v
Local files (default: never uploaded)
```

## Principle

UI business logic does not call WASM directly. It goes through `src/core/engine.ts`. This keeps the product usable when WASM is unavailable and lets future engines (DuckDB-WASM, Web Workers) plug in behind one interface.
