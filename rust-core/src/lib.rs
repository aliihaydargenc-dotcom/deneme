use serde::Serialize;
use sha2::{Digest, Sha256};
use std::collections::HashSet;
use wasm_bindgen::prelude::*;

#[derive(Serialize)]
struct CsvProfile {
    rows: usize,
    columns: usize,
    duplicates: usize,
    headers: Vec<String>,
}

#[wasm_bindgen]
pub fn engine_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[wasm_bindgen]
pub fn normalize_whitespace(input: &str) -> String {
    input
        .lines()
        .map(str::trim)
        .filter(|line| !line.is_empty())
        .collect::<Vec<_>>()
        .join("\n")
}

#[wasm_bindgen]
pub fn unique_lines(input: &str) -> String {
    let mut seen = HashSet::new();
    input
        .lines()
        .filter(|line| seen.insert((*line).to_string()))
        .collect::<Vec<_>>()
        .join("\n")
}

#[wasm_bindgen]
pub fn count_words(input: &str) -> usize {
    input.split_whitespace().count()
}

#[wasm_bindgen]
pub fn count_nonempty_lines(input: &str) -> usize {
    input.lines().filter(|line| !line.trim().is_empty()).count()
}

#[wasm_bindgen]
pub fn csv_profile(input: &str) -> Result<String, JsValue> {
    let mut reader = csv::ReaderBuilder::new()
        .flexible(true)
        .from_reader(input.as_bytes());

    let headers = reader
        .headers()
        .map_err(|error| JsValue::from_str(&error.to_string()))?
        .iter()
        .map(ToString::to_string)
        .collect::<Vec<_>>();

    let mut rows = 0usize;
    let mut duplicates = 0usize;
    let mut seen = HashSet::new();

    for record in reader.records() {
        let record = record.map_err(|error| JsValue::from_str(&error.to_string()))?;
        rows += 1;
        let key = record.iter().collect::<Vec<_>>().join("\u{1f}");
        if !seen.insert(key) {
            duplicates += 1;
        }
    }

    serde_json::to_string(&CsvProfile {
        rows,
        columns: headers.len(),
        duplicates,
        headers,
    })
    .map_err(|error| JsValue::from_str(&error.to_string()))
}

#[wasm_bindgen]
pub fn csv_dedupe(input: &str) -> Result<String, JsValue> {
    let mut reader = csv::ReaderBuilder::new()
        .flexible(true)
        .from_reader(input.as_bytes());
    let headers = reader
        .headers()
        .map_err(|error| JsValue::from_str(&error.to_string()))?
        .clone();

    let mut writer = csv::Writer::from_writer(vec![]);
    writer
        .write_record(&headers)
        .map_err(|error| JsValue::from_str(&error.to_string()))?;

    let mut seen = HashSet::new();
    for record in reader.records() {
        let record = record.map_err(|error| JsValue::from_str(&error.to_string()))?;
        let key = record.iter().collect::<Vec<_>>().join("\u{1f}");
        if seen.insert(key) {
            writer
                .write_record(&record)
                .map_err(|error| JsValue::from_str(&error.to_string()))?;
        }
    }

    let bytes = writer
        .into_inner()
        .map_err(|error| JsValue::from_str(&error.to_string()))?;
    String::from_utf8(bytes).map_err(|error| JsValue::from_str(&error.to_string()))
}

#[wasm_bindgen]
pub fn json_pretty(input: &str) -> Result<String, JsValue> {
    let value: serde_json::Value =
        serde_json::from_str(input).map_err(|error| JsValue::from_str(&error.to_string()))?;
    serde_json::to_string_pretty(&value).map_err(|error| JsValue::from_str(&error.to_string()))
}

#[wasm_bindgen]
pub fn json_minify(input: &str) -> Result<String, JsValue> {
    let value: serde_json::Value =
        serde_json::from_str(input).map_err(|error| JsValue::from_str(&error.to_string()))?;
    serde_json::to_string(&value).map_err(|error| JsValue::from_str(&error.to_string()))
}

#[wasm_bindgen]
pub fn sha256_hex(input: &[u8]) -> String {
    let digest = Sha256::digest(input);
    format!("{:x}", digest)
}
