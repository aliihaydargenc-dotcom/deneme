import './styles.css';
import { engine, engineMode, initEngine } from './core/engine';
import { parseCsv } from './core/fallback';
import { categories, tools, type ToolId } from './tools/catalog';

const app = document.querySelector<HTMLDivElement>('#app')!;
let activeCategory = 'Tümü';
let search = '';
let currentFile: File | null = null;
let currentFileText = '';
let workflow: string[] = [];

app.innerHTML = `
  <div class="shell">
    <aside class="sidebar">
      <div class="brand"><div class="brand-mark">T</div><div><strong>Toolbox</strong><span>WEB / RUST</span></div></div>
      <nav id="categoryNav"></nav>
      <div class="sidebar-card">
        <span class="eyebrow">Motor</span>
        <strong id="engineBadge">Başlatılıyor…</strong>
        <small>Desteklenirse işlemler Rust/WebAssembly üzerinde çalışır.</small>
      </div>
      <div class="privacy"><span class="privacy-dot"></span><div><b>Local-first</b><small>Dosyalar varsayılan olarak cihazından çıkmaz.</small></div></div>
    </aside>
    <main class="content">
      <header class="topbar">
        <div class="searchbox"><span>⌕</span><input id="searchInput" placeholder="Araç ara veya ne yapmak istediğini yaz…"/><kbd>Ctrl K</kbd></div>
        <a class="github-link" href="https://github.com/aliihaydargenc-dotcom/deneme" target="_blank" rel="noreferrer">GitHub ↗</a>
      </header>
      <section class="hero">
        <div>
          <span class="eyebrow">LOCAL-FIRST TOOLKIT</span>
          <h1>Dosyayı bırak.<br/><em>İşlemi seç.</em> Bitti.</h1>
          <p>Veri, metin ve geliştirici araçları tek yerde. Rust/WebAssembly çekirdeği ile tarayıcı içinde çalışan güçlü bir araç kutusu.</p>
        </div>
        <div class="hero-metrics">
          <div><b>${tools.length}</b><span>çalışan araç</span></div>
          <div><b>${tools.filter((tool) => tool.rust).length}</b><span>Rust-ready</span></div>
          <div><b>0</b><span>zorunlu upload</span></div>
        </div>
      </section>
      <section id="dropZone" class="drop-zone">
        <input id="fileInput" type="file" hidden />
        <div class="drop-icon">⇩</div>
        <div><strong>Dosyanı buraya bırak</strong><span>CSV, JSON, TXT veya herhangi bir dosyayı hash için seçebilirsin.</span></div>
        <button id="pickFile" class="button secondary">Dosya seç</button>
      </section>
      <section class="section-head"><div><span class="eyebrow">ARAÇLAR</span><h2>Toolbox</h2></div><span id="toolCount"></span></section>
      <section id="toolGrid" class="tool-grid"></section>
    </main>
  </div>
  <div id="modal" class="modal hidden"><div class="modal-backdrop" data-close></div><div class="modal-card"><button class="modal-close" data-close>×</button><div id="modalHead"></div><div id="modalBody"></div></div></div>
  <div id="toast" class="toast hidden"></div>
`;

const qs = <T extends Element>(selector: string) => document.querySelector<T>(selector)!;
const escapeHtml = (value: unknown) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
const toast = (message: string) => { const el = qs<HTMLDivElement>('#toast'); el.textContent = message; el.classList.remove('hidden'); window.setTimeout(() => el.classList.add('hidden'), 2200); };
const download = (name: string, data: BlobPart, type = 'text/plain;charset=utf-8') => { const url = URL.createObjectURL(new Blob([data], { type })); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); window.setTimeout(() => URL.revokeObjectURL(url), 500); };

function renderCategories() {
  qs('#categoryNav').innerHTML = categories.map((category) => `<button class="nav-item ${category === activeCategory ? 'active' : ''}" data-category="${category}">${category}</button>`).join('');
  document.querySelectorAll<HTMLButtonElement>('[data-category]').forEach((button) => button.addEventListener('click', () => { activeCategory = button.dataset.category!; renderCategories(); renderTools(); }));
}

function renderTools() {
  const query = search.trim().toLocaleLowerCase('tr-TR');
  const filtered = tools.filter((tool) => (activeCategory === 'Tümü' || tool.category === activeCategory) && (!query || `${tool.title} ${tool.description} ${tool.badge}`.toLocaleLowerCase('tr-TR').includes(query)));
  qs('#toolCount').textContent = `${filtered.length} araç`;
  qs('#toolGrid').innerHTML = filtered.map((tool) => `
    <article class="tool-card" data-tool="${tool.id}">
      <div class="tool-top"><div class="tool-icon">${tool.icon}</div>${tool.rust ? '<span class="rust-pill">RUST</span>' : ''}</div>
      <h3>${tool.title}</h3><p>${tool.description}</p>
      <div class="tool-footer"><span>${tool.badge}</span><b>→</b></div>
    </article>`).join('');
  document.querySelectorAll<HTMLElement>('[data-tool]').forEach((card) => card.addEventListener('click', () => openTool(card.dataset.tool as ToolId)));
}

function openModal(title: string, subtitle: string, icon: string, html: string) {
  qs('#modalHead').innerHTML = `<div class="modal-title"><div class="tool-icon large">${icon}</div><div><h2>${title}</h2><p>${subtitle}</p></div></div>`;
  qs('#modalBody').innerHTML = html;
  qs('#modal').classList.remove('hidden');
}
function closeModal() { qs('#modal').classList.add('hidden'); qs('#modalBody').innerHTML = ''; }
document.querySelectorAll('[data-close]').forEach((element) => element.addEventListener('click', closeModal));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); qs<HTMLInputElement>('#searchInput').focus(); } });

function openTool(id: ToolId) {
  const tool = tools.find((item) => item.id === id)!;
  if (id === 'csv') return openCsv(tool.title, tool.description, tool.icon);
  if (id === 'json') return openJson(tool.title, tool.description, tool.icon);
  if (id === 'text') return openText(tool.title, tool.description, tool.icon);
  if (id === 'workflow') return openWorkflow(tool.title, tool.description, tool.icon);
  if (id === 'hash') return openHash(tool.title, tool.description, tool.icon);
  if (id === 'base64') return openBase64(tool.title, tool.description, tool.icon);
  if (id === 'url') return openUrl(tool.title, tool.description, tool.icon);
  if (id === 'uuid') return openUuid(tool.title, tool.description, tool.icon);
  if (id === 'regex') return openRegex(tool.title, tool.description, tool.icon);
  return openTimestamp(tool.title, tool.description, tool.icon);
}

function openCsv(title: string, desc: string, icon: string) {
  openModal(title, desc, icon, `<div class="field"><label>CSV içeriği</label><textarea id="csvInput" placeholder="CSV yapıştır veya ana ekrana dosya bırak"></textarea></div><div class="actions"><button id="csvAnalyze" class="button primary">Analiz et</button><button id="csvDedupe" class="button secondary">Duplicate temizle</button><button id="csvDownload" class="button secondary">CSV indir</button></div><div id="csvResult"></div>`);
  const input = qs<HTMLTextAreaElement>('#csvInput'); if (currentFileText && currentFile?.name.toLowerCase().endsWith('.csv')) input.value = currentFileText;
  const analyze = () => { try { const profile = engine.csvProfile(input.value); const rows = parseCsv(input.value).slice(0, 11); qs('#csvResult').innerHTML = `<div class="metric-grid"><div><b>${profile.rows.toLocaleString('tr-TR')}</b><span>Satır</span></div><div><b>${profile.columns}</b><span>Kolon</span></div><div><b>${profile.duplicates.toLocaleString('tr-TR')}</b><span>Duplicate</span></div><div><b>${engineMode().startsWith('Rust') ? 'WASM' : 'TS'}</b><span>Motor</span></div></div>${rows.length ? `<div class="table-wrap"><table>${rows.map((row, i) => `<tr>${row.map((cell) => `<${i === 0 ? 'th' : 'td'}>${escapeHtml(cell)}</${i === 0 ? 'th' : 'td'}>`).join('')}</tr>`).join('')}</table></div>` : ''}`; } catch (error) { qs('#csvResult').innerHTML = `<div class="notice error">${escapeHtml(error)}</div>`; } };
  qs('#csvAnalyze').addEventListener('click', analyze);
  qs('#csvDedupe').addEventListener('click', () => { try { input.value = engine.csvDedupe(input.value); analyze(); toast('Duplicate satırlar temizlendi.'); } catch (error) { toast(`Hata: ${String(error)}`); } });
  qs('#csvDownload').addEventListener('click', () => download('toolbox-clean.csv', input.value, 'text/csv;charset=utf-8'));
  if (input.value) analyze();
}

function openJson(title: string, desc: string, icon: string) {
  openModal(title, desc, icon, `<div class="split"><div class="field"><label>Girdi</label><textarea id="jsonInput"></textarea></div><div class="field"><label>Çıktı</label><textarea id="jsonOutput" readonly></textarea></div></div><div class="actions"><button id="jsonPretty" class="button primary">Düzenle</button><button id="jsonMin" class="button secondary">Minify</button><button id="jsonCopy" class="button secondary">Kopyala</button></div>`);
  const input = qs<HTMLTextAreaElement>('#jsonInput'); const output = qs<HTMLTextAreaElement>('#jsonOutput'); if (currentFileText && currentFile?.name.toLowerCase().endsWith('.json')) input.value = currentFileText;
  const run = (pretty: boolean) => { try { output.value = pretty ? engine.jsonPretty(input.value) : engine.jsonMinify(input.value); } catch (error) { output.value = `Geçersiz JSON: ${String(error)}`; } };
  qs('#jsonPretty').addEventListener('click', () => run(true)); qs('#jsonMin').addEventListener('click', () => run(false)); qs('#jsonCopy').addEventListener('click', async () => { await navigator.clipboard.writeText(output.value); toast('Kopyalandı.'); });
}

function openText(title: string, desc: string, icon: string) {
  openModal(title, desc, icon, `<div class="split"><div class="field"><label>Girdi</label><textarea id="textInput"></textarea></div><div class="field"><label>Çıktı</label><textarea id="textOutput" readonly></textarea></div></div><div class="actions"><button class="button secondary text-op" data-op="normalize">Boşluk temizle</button><button class="button secondary text-op" data-op="unique">Tekrar sil</button><button class="button secondary text-op" data-op="upper">BÜYÜK</button><button class="button secondary text-op" data-op="lower">küçük</button></div><div id="textStats" class="notice"></div>`);
  const input = qs<HTMLTextAreaElement>('#textInput'); const output = qs<HTMLTextAreaElement>('#textOutput'); if (currentFileText && currentFile?.type.startsWith('text/')) input.value = currentFileText;
  const apply = (op: string) => { const value = input.value; output.value = op === 'normalize' ? engine.normalizeWhitespace(value) : op === 'unique' ? engine.uniqueLines(value) : op === 'upper' ? value.toLocaleUpperCase('tr-TR') : value.toLocaleLowerCase('tr-TR'); qs('#textStats').textContent = `${engine.countWords(output.value).toLocaleString('tr-TR')} kelime · ${engine.countNonemptyLines(output.value).toLocaleString('tr-TR')} dolu satır · ${engineMode()}`; };
  document.querySelectorAll<HTMLButtonElement>('.text-op').forEach((button) => button.addEventListener('click', () => apply(button.dataset.op!)));
}

function openWorkflow(title: string, desc: string, icon: string) {
  openModal(title, desc, icon, `<div class="split"><div><div class="field"><label>Kaynak</label><textarea id="wfInput"></textarea></div><div class="actions"><select id="wfSelect"><option value="normalize">Boşluk temizle</option><option value="unique">Tekrar satırları sil</option><option value="upper">Büyük harf</option><option value="lower">Küçük harf</option></select><button id="wfAdd" class="button secondary">Adım ekle</button></div><div id="wfSteps" class="workflow"></div></div><div><div class="field"><label>Çıktı</label><textarea id="wfOutput" readonly></textarea></div><div class="actions"><button id="wfRun" class="button primary">Workflow çalıştır</button><button id="wfClear" class="button danger">Temizle</button></div></div></div>`);
  const render = () => { qs('#wfSteps').innerHTML = workflow.length ? workflow.map((step, i) => `<button class="workflow-step" data-index="${i}"><b>${i + 1}</b>${step}<span>×</span></button>`).join('') : '<div class="notice">Henüz adım yok.</div>'; document.querySelectorAll<HTMLButtonElement>('.workflow-step').forEach((button) => button.addEventListener('click', () => { workflow.splice(Number(button.dataset.index), 1); render(); })); };
  qs('#wfAdd').addEventListener('click', () => { workflow.push(qs<HTMLSelectElement>('#wfSelect').value); render(); });
  qs('#wfRun').addEventListener('click', () => { let value = qs<HTMLTextAreaElement>('#wfInput').value; for (const step of workflow) value = step === 'normalize' ? engine.normalizeWhitespace(value) : step === 'unique' ? engine.uniqueLines(value) : step === 'upper' ? value.toLocaleUpperCase('tr-TR') : value.toLocaleLowerCase('tr-TR'); qs<HTMLTextAreaElement>('#wfOutput').value = value; });
  qs('#wfClear').addEventListener('click', () => { workflow = []; render(); }); render();
}

function openHash(title: string, desc: string, icon: string) {
  openModal(title, desc, icon, `<div class="field"><label>Dosya</label><input id="hashFile" type="file" class="file-control"/></div><div class="actions"><button id="hashRun" class="button primary">SHA-256 hesapla</button></div><div id="hashResult" class="notice mono">Dosya bekleniyor.</div>`);
  const input = qs<HTMLInputElement>('#hashFile'); if (currentFile) { const dt = new DataTransfer(); dt.items.add(currentFile); input.files = dt.files; }
  qs('#hashRun').addEventListener('click', async () => { const file = input.files?.[0]; if (!file) return toast('Önce dosya seç.'); const hash = await engine.sha256Hex(new Uint8Array(await file.arrayBuffer())); qs('#hashResult').textContent = `${hash}\n${file.name} · ${file.size.toLocaleString('tr-TR')} byte · ${engineMode()}`; });
}

function openBase64(title: string, desc: string, icon: string) { openModal(title, desc, icon, `<div class="split"><div class="field"><label>Girdi</label><textarea id="xIn"></textarea></div><div class="field"><label>Çıktı</label><textarea id="xOut" readonly></textarea></div></div><div class="actions"><button id="enc" class="button primary">Encode</button><button id="dec" class="button secondary">Decode</button></div>`); const input = qs<HTMLTextAreaElement>('#xIn'); const output = qs<HTMLTextAreaElement>('#xOut'); qs('#enc').addEventListener('click', () => output.value = btoa(unescape(encodeURIComponent(input.value)))); qs('#dec').addEventListener('click', () => { try { output.value = decodeURIComponent(escape(atob(input.value))); } catch { output.value = 'Geçersiz Base64.'; } }); }
function openUrl(title: string, desc: string, icon: string) { openModal(title, desc, icon, `<div class="split"><div class="field"><label>Girdi</label><textarea id="xIn"></textarea></div><div class="field"><label>Çıktı</label><textarea id="xOut" readonly></textarea></div></div><div class="actions"><button id="enc" class="button primary">Encode</button><button id="dec" class="button secondary">Decode</button></div>`); const input = qs<HTMLTextAreaElement>('#xIn'); const output = qs<HTMLTextAreaElement>('#xOut'); qs('#enc').addEventListener('click', () => output.value = encodeURIComponent(input.value)); qs('#dec').addEventListener('click', () => { try { output.value = decodeURIComponent(input.value); } catch { output.value = 'Geçersiz URL kodlaması.'; } }); }
function openUuid(title: string, desc: string, icon: string) { openModal(title, desc, icon, `<div class="field"><label>Adet</label><input id="uuidCount" type="number" min="1" max="500" value="10"/></div><div class="actions"><button id="uuidRun" class="button primary">Üret</button></div><div class="field"><textarea id="uuidOut" readonly></textarea></div>`); qs('#uuidRun').addEventListener('click', () => { const count = Math.min(500, Math.max(1, Number(qs<HTMLInputElement>('#uuidCount').value))); qs<HTMLTextAreaElement>('#uuidOut').value = Array.from({ length: count }, () => crypto.randomUUID()).join('\n'); }); }
function openRegex(title: string, desc: string, icon: string) { openModal(title, desc, icon, `<div class="split small"><div class="field"><label>Regex</label><input id="rxPattern" value="\\b\\w{5,}\\b"/></div><div class="field"><label>Flags</label><input id="rxFlags" value="gi"/></div></div><div class="field"><label>Metin</label><textarea id="rxText"></textarea></div><div class="actions"><button id="rxRun" class="button primary">Test et</button></div><div id="rxResult" class="notice"></div>`); qs('#rxRun').addEventListener('click', () => { try { const re = new RegExp(qs<HTMLInputElement>('#rxPattern').value, qs<HTMLInputElement>('#rxFlags').value); const matches = [...qs<HTMLTextAreaElement>('#rxText').value.matchAll(re)].map((match) => match[0]); qs('#rxResult').textContent = matches.length ? `${matches.length} eşleşme: ${matches.slice(0, 30).join(' · ')}` : 'Eşleşme yok.'; } catch (error) { qs('#rxResult').textContent = `Regex hatası: ${String(error)}`; } }); }
function openTimestamp(title: string, desc: string, icon: string) { openModal(title, desc, icon, `<div class="field"><label>Unix timestamp</label><input id="tsInput" placeholder="1700000000"/></div><div class="actions"><button id="tsRun" class="button primary">Tarihe çevir</button><button id="tsNow" class="button secondary">Şimdi</button></div><div id="tsResult" class="notice"></div>`); const show = (value: number) => { const ms = value < 1e12 ? value * 1000 : value; const date = new Date(ms); qs('#tsResult').textContent = Number.isNaN(date.getTime()) ? 'Geçersiz değer.' : `${date.toLocaleString('tr-TR')} · ${date.toISOString()}`; }; qs('#tsRun').addEventListener('click', () => show(Number(qs<HTMLInputElement>('#tsInput').value))); qs('#tsNow').addEventListener('click', () => { const now = Date.now(); qs<HTMLInputElement>('#tsInput').value = String(Math.floor(now / 1000)); show(now); }); }

async function handleFile(file: File) {
  currentFile = file;
  currentFileText = file.size <= 25 * 1024 * 1024 ? await file.text().catch(() => '') : '';
  toast(`${file.name} hazır.`);
  const name = file.name.toLowerCase();
  if (name.endsWith('.csv')) openTool('csv'); else if (name.endsWith('.json')) openTool('json'); else if (file.type.startsWith('text/') || name.endsWith('.txt')) openTool('text'); else openTool('hash');
}

const dropZone = qs<HTMLElement>('#dropZone'); const fileInput = qs<HTMLInputElement>('#fileInput');
qs('#pickFile').addEventListener('click', () => fileInput.click()); fileInput.addEventListener('change', () => fileInput.files?.[0] && handleFile(fileInput.files[0]));
['dragenter', 'dragover'].forEach((eventName) => dropZone.addEventListener(eventName, (event) => { event.preventDefault(); dropZone.classList.add('dragging'); }));
['dragleave', 'drop'].forEach((eventName) => dropZone.addEventListener(eventName, (event) => { event.preventDefault(); dropZone.classList.remove('dragging'); })); dropZone.addEventListener('drop', (event) => { const file = event.dataTransfer?.files[0]; if (file) handleFile(file); });
qs<HTMLInputElement>('#searchInput').addEventListener('input', (event) => { search = (event.target as HTMLInputElement).value; renderTools(); });

renderCategories(); renderTools();
initEngine().then((label) => { qs('#engineBadge').textContent = label; document.body.dataset.engine = label.startsWith('Rust') ? 'wasm' : 'fallback'; });
