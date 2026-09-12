const STORAGE_PREFIX = 'uvero_static_clipboard_'

function isStaticGitHubPages() {
  return typeof window !== 'undefined' && window.location.hostname.endsWith('.github.io')
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function storageKey(type, id) {
  return `${STORAGE_PREFIX}${type}:${id}`
}

function parseExpiry(value) {
  if (!value || typeof value !== 'string') return null
  const amount = Number.parseInt(value, 10)
  if (!Number.isFinite(amount)) return null
  if (value.endsWith('h')) return Date.now() + amount * 60 * 60 * 1000
  if (value.endsWith('d')) return Date.now() + amount * 24 * 60 * 60 * 1000
  return null
}

function readRecord(type, id) {
  try {
    const raw = window.localStorage.getItem(storageKey(type, id))
    if (!raw) return null
    const record = JSON.parse(raw)
    if (record.expires_at && Date.parse(record.expires_at) <= Date.now()) {
      window.localStorage.removeItem(storageKey(type, id))
      return null
    }
    return record
  } catch {
    return null
  }
}

function writeRecord(type, id, record) {
  window.localStorage.setItem(storageKey(type, id), JSON.stringify(record))
}

function deleteRecord(type, id) {
  window.localStorage.removeItem(storageKey(type, id))
}

function generatePublicCode() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const code = String(Math.floor(1000 + Math.random() * 9000))
    if (!readRecord('public', code)) return code
  }
  return String(Date.now()).slice(-4)
}

async function handleStaticClipboardRequest(input, init = {}) {
  const rawUrl = typeof input === 'string' ? input : input?.url
  if (!rawUrl) return null

  const url = new URL(rawUrl, window.location.origin)
  if (url.pathname !== '/api/clipboard') return null

  const method = String(init.method || (typeof input !== 'string' ? input?.method : 'GET') || 'GET').toUpperCase()

  if (method === 'POST') {
    let body = {}
    try {
      const rawBody = init.body ?? (typeof input !== 'string' ? await input.clone().text() : '')
      body = rawBody ? JSON.parse(rawBody) : {}
    } catch {
      return jsonResponse({ error: 'Invalid clipboard payload' }, 400)
    }

    const type = body.type === 'private' ? 'private' : 'public'
    const id = String(body.boardId || (type === 'public' ? generatePublicCode() : '')).trim()
    if (!id) return jsonResponse({ error: 'Board id is required' }, 400)

    const existing = readRecord(type, id)
    const expiresAtMs = body.expiresIn ? parseExpiry(body.expiresIn) : null
    const expiresAt = expiresAtMs
      ? new Date(expiresAtMs).toISOString()
      : (existing?.expires_at || null)

    const record = {
      id,
      content: String(body.content ?? ''),
      language: body.language || existing?.language || 'plaintext',
      password: body.password || existing?.password || null,
      burn_after_read: Boolean(body.burnAfterRead ?? existing?.burn_after_read ?? false),
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
      local_only: true,
    }

    writeRecord(type, id, record)
    return jsonResponse({ data: record })
  }

  if (method === 'GET') {
    const code = url.searchParams.get('code')
    const board = url.searchParams.get('board')
    const type = url.searchParams.get('type') === 'private' || board ? 'private' : 'public'
    const id = String(code || board || '').trim()
    if (!id) return jsonResponse({ error: 'Clipboard id is required' }, 400)

    const record = readRecord(type, id)
    if (!record) return jsonResponse({ error: 'Clipboard not found' }, 404)

    if (type === 'private' && record.password) {
      const supplied = url.searchParams.get('password') || ''
      if (supplied !== record.password) {
        return jsonResponse({ error: 'Password required', needsPassword: true }, 403)
      }
    }

    const payload = { ...record }
    if (record.burn_after_read) deleteRecord(type, id)
    return jsonResponse({ data: payload })
  }

  if (method === 'DELETE') {
    const board = url.searchParams.get('board')
    const code = url.searchParams.get('code')
    const type = url.searchParams.get('type') === 'private' || board ? 'private' : 'public'
    const id = String(board || code || '').trim()
    if (!id) return jsonResponse({ error: 'Clipboard id is required' }, 400)
    deleteRecord(type, id)
    return jsonResponse({ data: { deleted: true, id } })
  }

  return jsonResponse({ error: `Method ${method} not supported in static clipboard mode` }, 405)
}

export function initStaticClipboardApi() {
  if (!isStaticGitHubPages() || window.__uveroStaticClipboardApiInstalled) return

  const nativeFetch = window.fetch.bind(window)
  window.__uveroStaticClipboardApiInstalled = true

  window.fetch = async (input, init) => {
    const localResponse = await handleStaticClipboardRequest(input, init)
    if (localResponse) return localResponse
    return nativeFetch(input, init)
  }
}
