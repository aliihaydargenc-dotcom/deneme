const STORAGE_KEY = 'uvero_language';

const EN_TO_TR = {
  'Search': 'Ara',
  'Sign in': 'Giriş yap',
  'Sign out': 'Çıkış yap',
  'Set username': 'Kullanıcı adı belirle',
  'Loading...': 'Yükleniyor...',
  'Home': 'Ana Sayfa',
  'History': 'Geçmiş',
  'Command': 'Komut',
  'Favorites': 'Favoriler',
  'Profile': 'Profil',
  'Privacy': 'Gizlilik',
  'Contact': 'İletişim',
  'All rights reserved.': 'Tüm hakları saklıdır.',
  '© 2026 Uvero. All rights reserved.': '© 2026 Uvero. Tüm hakları saklıdır.',

  'Command Mode Active': 'Komut Modu Aktif',
  'Switch to Visual Catalog': 'Görsel Kataloğa Geç',
  'Switch to Visual Catalog Homepage': 'Görsel katalog ana sayfasına geç',
  'Tell me what to do or choose a suggestion.': 'Ne yapmak istediğini yaz veya bir öneri seç.',
  'Done — what\'s next?': 'Tamam — sırada ne var?',
  'Convert files': 'Dosya dönüştür',
  'File transfer': 'Dosya aktarımı',
  'Generate QR': 'QR oluştur',
  'Share text': 'Metin paylaş',
  'Run code': 'Kod çalıştır',
  '4 capabilities · 200+ actions · 100% private': '4 yetenek · 200+ işlem · %100 gizli',

  'Toolbox': 'Araç Kutusu',
  'Convert, edit, and package files': 'Dosyaları dönüştür, düzenle ve paketle',
  'Drop a file and run the tool directly. Use CommandBar for cross-service jumps.': 'Dosyanı bırak ve aracı doğrudan çalıştır. Diğer hizmetlere geçmek için Komut Çubuğunu kullan.',
  'Unified Converter': 'Birleşik Dönüştürücü',
  'Private file processing. Drop, choose output, run.': 'Gizli dosya işleme. Dosyayı bırak, çıktıyı seç, çalıştır.',
  'Engine Ready': 'Motor Hazır',
  'Optimizing': 'Optimize Ediliyor',
  'Engine Idle': 'Motor Beklemede',
  'Discard': 'Temizle',
  'Add Files': 'Dosya Ekle',
  'Uploaded File': 'Yüklenen Dosya',
  'Uploaded Files': 'Yüklenen Dosyalar',
  'Preview': 'Önizleme',
  'Actions': 'İşlemler',
  'Search formats...': 'Format ara...',
  'Adjust Crop Area': 'Kırpma Alanını Ayarla',
  '✂️ Adjust Crop Area': '✂️ Kırpma Alanını Ayarla',
  'Resize Settings': 'Boyutlandırma Ayarları',
  '📏 Resize Settings': '📏 Boyutlandırma Ayarları',
  'Auto': 'Otomatik',
  'Dimensions': 'Boyutlar',
  'Percentage': 'Yüzde',
  'Width': 'Genişlik',
  'Height': 'Yükseklik',
  'Maintain aspect ratio': 'En-boy oranını koru',
  'Convert': 'Dönüştür',
  'Processing...': 'İşleniyor...',
  'Loading AI Model...': 'Yapay zekâ modeli yükleniyor...',
  'Preparing Crop...': 'Kırpma hazırlanıyor...',
  'Preparing Resize...': 'Boyutlandırma hazırlanıyor...',
  'Preparing Watermark...': 'Filigran hazırlanıyor...',
  'Initializing Engine...': 'Motor başlatılıyor...',
  'Conversion failed': 'Dönüştürme başarısız',
  'Download': 'İndir',
  'Download File': 'Dosyayı İndir',
  'Reset': 'Sıfırla',
  'Remove': 'Kaldır',
  'Remove Background': 'Arka Planı Kaldır',
  'Crop': 'Kırp',
  'Resize': 'Boyutlandır',
  'Watermark': 'Filigran',
  'Image Converter': 'Görsel Dönüştürücü',
  'Document Converter': 'Belge Dönüştürücü',
  'Audio Converter': 'Ses Dönüştürücü',
  'Video Converter': 'Video Dönüştürücü',
  'WASM powered': 'WASM destekli',
  'Unsupported file type. Please upload an image, audio file, or document.': 'Desteklenmeyen dosya türü. Lütfen görsel, ses dosyası veya belge yükleyin.',
  'Convert between 50+ image formats (JPG, PNG, WebP, AVIF, HEIC, TIFF, PSD, RAW, etc.)': '50+ görsel formatı arasında dönüştürme yap (JPG, PNG, WebP, AVIF, HEIC, TIFF, PSD, RAW vb.)',
  'Convert documents (DOCX, PDF, EPUB, HTML, Markdown, etc.) using Pandoc': 'Pandoc ile belgeleri dönüştür (DOCX, PDF, EPUB, HTML, Markdown vb.)',
  'Convert audio files (MP3, WAV, FLAC, AAC, OGG, etc.) entirely in your browser': 'Ses dosyalarını tamamen tarayıcında dönüştür (MP3, WAV, FLAC, AAC, OGG vb.)',
  'Convert video files (MP4, MKV, WebM, GIF, etc.) entirely in your browser': 'Video dosyalarını tamamen tarayıcında dönüştür (MP4, MKV, WebM, GIF vb.)',

  'QR Tools': 'QR Araçları',
  'QR Generator': 'QR Oluşturucu',
  'QR Scanner': 'QR Tarayıcı',
  'QR Validator': 'QR Doğrulayıcı',
  'Bulk QR Generator': 'Toplu QR Oluşturucu',
  'Dynamic QR': 'Dinamik QR',
  'Analytics': 'Analizler',
  'Generate': 'Oluştur',
  'Scan': 'Tara',
  'Validate': 'Doğrula',

  'Clipboard': 'Pano',
  'Create board': 'Pano oluştur',
  'Join board': 'Panoya katıl',
  'Share': 'Paylaş',
  'Copy': 'Kopyala',
  'Copied': 'Kopyalandı',
  'Paste': 'Yapıştır',
  'Upload': 'Yükle',
  'Choose File': 'Dosya Seç',
  'Choose Files': 'Dosyaları Seç',
  'Drag and drop': 'Sürükle ve bırak',
  'Browse': 'Gözat',

  'Compiler': 'Kod Çalıştırıcı',
  'Run': 'Çalıştır',
  'Output': 'Çıktı',
  'Clear': 'Temizle',

  'Settings': 'Ayarlar',
  'Theme': 'Tema',
  'Dark': 'Koyu',
  'Light': 'Açık',
  'System': 'Sistem',
  'Save': 'Kaydet',
  'Cancel': 'İptal',
  'Close': 'Kapat',
  'Back': 'Geri',
  'Next': 'İleri',
  'Previous': 'Önceki',
  'Delete': 'Sil',
  'Edit': 'Düzenle',
  'Create': 'Oluştur',
  'Open': 'Aç',
  'Select': 'Seç',
  'Select file': 'Dosya seç',
  'Select files': 'Dosyaları seç',
  'Try again': 'Tekrar dene',
  'Error': 'Hata',
  'Success': 'Başarılı',
  'Ready': 'Hazır',
  'Cancel upload': 'Yüklemeyi iptal et',

  'Email': 'E-posta',
  'Password': 'Şifre',
  'Username': 'Kullanıcı adı',
  'Log in': 'Giriş yap',
  'Login': 'Giriş',
  'Sign up': 'Kayıt ol',
  'Create account': 'Hesap oluştur',
  'Forgot password?': 'Şifreni mi unuttun?',
  'Reset password': 'Şifreyi sıfırla',
  'Account': 'Hesap',
  'Log out': 'Çıkış yap',

  'No history yet': 'Henüz geçmiş yok',
  'No favorites yet': 'Henüz favori yok',
  'Recent': 'Son Kullanılanlar',
  'Popular': 'Popüler',
  'Tools': 'Araçlar',
  'Other Tools': 'Diğer Araçlar',
  'File Tools': 'Dosya Araçları',
  'PDF Tools': 'PDF Araçları',
  'Image Tools': 'Görsel Araçları',
  'Text Tools': 'Metin Araçları',
  'Developer Tools': 'Geliştirici Araçları',
  'Privacy-first': 'Gizlilik odaklı',
  '100% private': '%100 gizli',
  'Runs locally in your browser': 'Tarayıcında yerel olarak çalışır',
};

const TR_TO_EN = Object.fromEntries(Object.entries(EN_TO_TR).map(([en, tr]) => [tr, en]));
const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'title', 'aria-label'];
let currentLanguage = 'tr';
let observer = null;
let scheduled = false;

export function getLanguage() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === 'en' || saved === 'tr' ? saved : 'tr';
  } catch {
    return 'tr';
  }
}

function translateDynamic(value, language) {
  const text = value.trim();
  if (!text) return value;

  if (language === 'tr') {
    let match = text.match(/^(\d+) files selected$/i);
    if (match) return `${match[1]} dosya seçildi`;
    match = text.match(/^Preview not available for (.+)$/i);
    if (match) return `${match[1]} için önizleme kullanılamıyor`;
    match = text.match(/^No formats found matching "(.+)"$/i);
    if (match) return `"${match[1]}" ile eşleşen format bulunamadı`;
    match = text.match(/^Drop (.+) files here or tap to browse$/i);
    if (match) return `${match[1]} dosyalarını buraya bırak veya gözatmak için dokun`;
  } else {
    let match = text.match(/^(\d+) dosya seçildi$/i);
    if (match) return `${match[1]} files selected`;
    match = text.match(/^(.+) için önizleme kullanılamıyor$/i);
    if (match) return `Preview not available for ${match[1]}`;
    match = text.match(/^"(.+)" ile eşleşen format bulunamadı$/i);
    if (match) return `No formats found matching "${match[1]}"`;
    match = text.match(/^(.+) dosyalarını buraya bırak veya gözatmak için dokun$/i);
    if (match) return `Drop ${match[1]} files here or tap to browse`;
  }

  return value;
}

function translateValue(value, language) {
  if (typeof value !== 'string' || !value.trim()) return value;
  const prefix = value.match(/^\s*/)?.[0] || '';
  const suffix = value.match(/\s*$/)?.[0] || '';
  const core = value.trim();
  const table = language === 'tr' ? EN_TO_TR : TR_TO_EN;
  const exact = table[core];
  const translated = exact ?? translateDynamic(core, language);
  return `${prefix}${translated}${suffix}`;
}

function translateElement(element, language) {
  if (!(element instanceof Element)) return;
  if (element.closest('[data-i18n-ignore="true"]')) return;

  for (const attr of TRANSLATABLE_ATTRIBUTES) {
    if (!element.hasAttribute(attr)) continue;
    const before = element.getAttribute(attr);
    const after = translateValue(before, language);
    if (after !== before) element.setAttribute(attr, after);
  }
}

function translateTree(root, language) {
  if (!root) return;

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
  );

  let node = root;
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentElement;
      if (parent && !parent.closest('[data-i18n-ignore="true"]') && !['SCRIPT', 'STYLE', 'CODE', 'PRE'].includes(parent.tagName)) {
        const before = node.nodeValue;
        const after = translateValue(before, language);
        if (after !== before) node.nodeValue = after;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      translateElement(node, language);
    }
    node = walker.nextNode();
  }
}

function syncDocumentMeta(language) {
  document.documentElement.lang = language;
  document.title = language === 'tr'
    ? 'Uvero — Akıllı Dijital Araçlar'
    : 'Uvero — Intelligent Digital Tools';

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute(
      'content',
      language === 'tr'
        ? 'Dosyaları dönüştür, QR kodları oluştur, metin paylaş ve dijital işlerini gizlilik odaklı tek bir araç kutusunda tamamla.'
        : 'Uvero is an intelligent platform that resolves your digital tasks through a single command interface. Convert files, generate QR codes, share text, and more — all privately in your browser.',
    );
  }
}

function syncSelectors(language) {
  document.querySelectorAll('[data-uvero-language-select="true"]').forEach((select) => {
    if (select.value !== language) select.value = language;
  });
}

function applyLanguage(language) {
  currentLanguage = language;
  syncDocumentMeta(language);
  translateTree(document.body, language);
  syncSelectors(language);
}

export function setLanguage(language) {
  const next = language === 'en' ? 'en' : 'tr';
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Storage may be unavailable in privacy-restricted environments.
  }
  applyLanguage(next);
  window.dispatchEvent(new CustomEvent('uvero-language-change', { detail: { language: next } }));
}

function makeLanguageSelect(compact = false) {
  const wrapper = document.createElement('div');
  wrapper.dataset.i18nIgnore = 'true';
  wrapper.dataset.uveroLanguageControl = 'true';
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.flexShrink = '0';

  const select = document.createElement('select');
  select.dataset.uveroLanguageSelect = 'true';
  select.setAttribute('aria-label', 'Language / Dil');
  select.title = 'Language / Dil';
  select.innerHTML = '<option value="tr">TR</option><option value="en">EN</option>';
  select.value = currentLanguage;
  select.style.height = compact ? '32px' : '34px';
  select.style.minWidth = compact ? '48px' : '54px';
  select.style.padding = compact ? '0 6px' : '0 8px';
  select.style.borderRadius = '10px';
  select.style.border = '1px solid var(--border)';
  select.style.background = 'var(--surface-2)';
  select.style.color = 'var(--text-primary)';
  select.style.fontSize = '12px';
  select.style.fontWeight = '800';
  select.style.cursor = 'pointer';
  select.style.outline = 'none';
  select.addEventListener('change', (event) => setLanguage(event.target.value));

  wrapper.appendChild(select);
  return wrapper;
}

function ensureLanguageControls() {
  const header = document.querySelector('header');
  if (!header) return;

  const desktop = header.querySelector('.hidden.md\\:flex');
  if (desktop && !desktop.querySelector('[data-uvero-language-control="true"]')) {
    const themeToggle = desktop.querySelector('button[aria-label*="theme" i], button[title*="theme" i]');
    const control = makeLanguageSelect(false);
    if (themeToggle?.parentElement === desktop) desktop.insertBefore(control, themeToggle);
    else desktop.appendChild(control);
  }

  const mobile = header.querySelector('.flex.md\\:hidden');
  if (mobile && !mobile.querySelector('[data-uvero-language-control="true"]')) {
    const control = makeLanguageSelect(true);
    const themeToggle = mobile.querySelector('button[aria-label*="theme" i], button[title*="theme" i]');
    if (themeToggle?.parentElement === mobile) mobile.insertBefore(control, themeToggle);
    else mobile.appendChild(control);
  }

  syncSelectors(currentLanguage);
}

function scheduleRefresh() {
  if (scheduled) return;
  scheduled = true;
  window.requestAnimationFrame(() => {
    scheduled = false;
    ensureLanguageControls();
    translateTree(document.body, currentLanguage);
  });
}

export function initI18n() {
  currentLanguage = getLanguage();
  applyLanguage(currentLanguage);
  ensureLanguageControls();

  if (observer) observer.disconnect();
  observer = new MutationObserver(() => scheduleRefresh());
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY && (event.newValue === 'tr' || event.newValue === 'en')) {
      applyLanguage(event.newValue);
    }
  });

  scheduleRefresh();
}
