export type ToolId = 'csv' | 'json' | 'text' | 'workflow' | 'hash' | 'base64' | 'url' | 'uuid' | 'regex' | 'timestamp';

export type ToolDefinition = {
  id: ToolId;
  title: string;
  description: string;
  category: string;
  badge: string;
  icon: string;
  rust: boolean;
};

export const tools: ToolDefinition[] = [
  { id: 'csv', title: 'CSV Analiz & Temizle', description: 'Satır/kolon profili, duplicate tespiti ve tek tık temizleme.', category: 'Veri', badge: 'CSV', icon: '▦', rust: true },
  { id: 'json', title: 'JSON Formatter', description: 'JSON doğrula, okunabilir biçime getir veya minify et.', category: 'Veri', badge: 'JSON', icon: '{ }', rust: true },
  { id: 'text', title: 'Metin Temizleyici', description: 'Boşluk, tekrar satır, kelime ve satır işlemleri.', category: 'Metin', badge: 'TEXT', icon: 'Aa', rust: true },
  { id: 'workflow', title: 'Workflow Engine', description: 'Metin işlemlerini zincirle ve tek seferde çalıştır.', category: 'Otomasyon', badge: 'FLOW', icon: '⌁', rust: true },
  { id: 'hash', title: 'SHA-256 Hash', description: 'Dosyanın parmak izini cihazından çıkarmadan hesapla.', category: 'Dosya', badge: 'HASH', icon: '#', rust: true },
  { id: 'base64', title: 'Base64', description: 'UTF-8 metni Base64 kodla veya çöz.', category: 'Developer', badge: 'ENCODE', icon: '64', rust: false },
  { id: 'url', title: 'URL Encode / Decode', description: 'URL bileşenlerini güvenli biçimde kodla veya çöz.', category: 'Developer', badge: 'URL', icon: '↗', rust: false },
  { id: 'uuid', title: 'UUID v4 Üretici', description: 'Tek seferde 1–500 UUID üret.', category: 'Developer', badge: 'UUID', icon: 'ID', rust: false },
  { id: 'regex', title: 'Regex Tester', description: 'Regex ifadesini örnek metin üzerinde anında test et.', category: 'Developer', badge: 'REGEX', icon: '.*', rust: false },
  { id: 'timestamp', title: 'Timestamp Converter', description: 'Unix zamanı ile okunabilir tarih arasında dönüşüm yap.', category: 'Developer', badge: 'TIME', icon: '◷', rust: false },
];

export const categories = ['Tümü', 'Veri', 'Metin', 'Dosya', 'Otomasyon', 'Developer'];
