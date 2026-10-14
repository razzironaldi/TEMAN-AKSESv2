# Perubahan `server/index.mjs` — Old vs New

> Dokumentasi perbandingan versi lama (yang di-paste user) vs versi baru (sudah di-repo GitHub). Tujuannya agar tim/ pengembang berikutnya memahami *what*, *why*, dan *how* setiap perubahan.

---

## Ringkasan Eksekutif

| Aspek | Lama | Baru |
|-------|------|------|
| **Model handling** | Single model (`GEMINI_MODEL` atau default) | **Model fallback chain**: primary → fallback(s) → default |
| **Resilience** | 1 request, 30s timeout, no retry | **Retry + exponential backoff** per model, budget total 28s |
| **Caching** | Tidak ada | **In-memory answer cache** (SHA-256 key, 10 menit TTL, max 100 entries) |
| **Rate limiting** | Berdasarkan `remoteAddress` | **`x-forwarded-for` aware** (penting di Railway/Cloud Run) |
| **Observability** | Log minimal | Log detail: model, attempt, status, provider code |
| **Response metadata** | Hanya `answer` | `answer` + `retryable` flag untuk error 429/5xx |

---

## Diff Detail (Per Fungsi/Blok)

### 1. Import & Konstanta Baru

```diff
+ import { createHash } from 'node:crypto'
  
  const defaultModel = 'gemini-3.5-flash-lite'
  const rateLimits = new Map()
  const maxBodyBytes = 24_000
  const distDirectory = resolve(process.cwd(), 'dist')
  
+ // Ketahanan koneksi ke Gemini
+ const retryableStatuses = new Set([500, 502, 503, 504])
+ const maxAttemptsPerModel = 3
+ const attemptTimeoutMs = 12_000
+ const totalBudgetMs = 28_000
+ const retryBaseDelayMs = 800
+ 
+ // Cache jawaban (di memori) supaya pertanyaan yang sama tidak selalu memanggil Gemini
+ const answerCache = new Map()
+ const cacheTtlMs = 10 * 60_000
+ const cacheMaxEntries = 100
```

**Penjelasan:**
- `createHash` untuk generate cache key deterministic (SHA-256 dari `{contextAndQuestion, history}`)
- Retry config: max 3 attempt per model, tiap attempt max 12s, **total budget 28s** (supaya tidak nge-block request terlalu lama)
- Cache: 10 menit TTL, max 100 entries (LRU sederhana via `Map` order)

---

### 2. `getClientAddress(request)` — **Baru**

```js
// Di Railway semua permintaan lewat proxy, jadi remoteAddress selalu IP proxy.
// IP pengguna ada di header x-forwarded-for (entri pertama).
function getClientAddress(request) {
  const forwarded = request.headers['x-forwarded-for']
  const first = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : ''
  return first || request.socket.remoteAddress || 'local'
}
```

**Why:** Di Railway/Cloud Run, `request.socket.remoteAddress` = IP proxy/internal load balancer. Rate limiting harus pakai IP client asli dari header `x-forwarded-for`.

---

### 3. Cleanup Interval — **Baru**

```js
// Bersihkan data lama secara berkala agar memori tidak terus bertambah
setInterval(() => {
  const now = Date.now()
  for (const [address, entry] of rateLimits) {
    if (now - entry.startedAt >= 60_000) rateLimits.delete(address)
  }
  for (const [key, entry] of answerCache) {
    if (now > entry.expiresAt) answerCache.delete(key)
  }
}, 60_000).unref()
```

**Why:** Mencegah memory leak. `unref()` biar tidak mencegah process exit.

---

### 4. Helper Baru: `sleep`, `isValidModelName`, `getModelCandidates`

```js
const sleep = (ms) => new Promise((done) => setTimeout(done, ms))
const isValidModelName = (model) => /^[a-zA-Z0-9._-]+$/.test(model)

// Urutan model: GEMINI_MODEL, lalu GEMINI_FALLBACK_MODELS (pisahkan dengan koma), lalu model bawaan.
function getModelCandidates() {
  const primary = process.env.GEMINI_MODEL || defaultModel
  const fallbacks = (process.env.GEMINI_FALLBACK_MODELS || '')
    .split(',')
    .map((model) => model.trim())
    .filter(Boolean)
  return [...new Set([primary, ...fallbacks, defaultModel])].filter(isValidModelName)
}
```

**Why:** Fallback chain memungkinkan:
- `GEMINI_MODEL=gemini-1.5-flash` (primary)
- `GEMINI_FALLBACK_MODELS=gemini-1.5-flash-8b,gemini-3.5-flash-lite` (fallback kalau primary error/quota)
- Default `gemini-3.5-flash-lite` sebagai safety net

---

### 5. Cache Helpers — **Baru**

```js
function getCachedAnswer(key) {
  const entry = answerCache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    answerCache.delete(key)
    return null
  }
  return entry.answer
}

function setCachedAnswer(key, answer) {
  if (answerCache.size >= cacheMaxEntries) answerCache.delete(answerCache.keys().next().value)
  answerCache.set(key, { answer, expiresAt: Date.now() + cacheTtlMs })
}
```

**Key generation** (di handler POST):
```js
const cacheKey = createHash('sha256').update(JSON.stringify({ contextAndQuestion, history })).digest('hex')
```

**Why:** Pertanyaan + konteks + history yang sama → jawaban sama. Hemat quota & latency.

---

### 6. `requestGemini(model, requestBody, timeoutMs)` — **Baru (ekstrak dari inline fetch)**

```js
async function requestGemini(model, requestBody, timeoutMs) {
  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': process.env.GEMINI_API_KEY,
          'content-type': 'application/json',
        },
        body: requestBody,
        signal: AbortSignal.timeout(timeoutMs),
      },
    )

    if (geminiResponse.ok) {
      return { ok: true, result: await geminiResponse.json() }
    }

    const errorPayload = await geminiResponse.json().catch(() => null)
    const providerCode = errorPayload?.error?.status ?? errorPayload?.error?.code
    return {
      ok: false,
      status: geminiResponse.status,
      providerCode: typeof providerCode === 'string' ? providerCode.slice(0, 80) : '',
    }
  } catch (error) {
    // status 0 = gagal jaringan atau timeout
    return { ok: false, status: 0, providerCode: error instanceof Error ? error.name : 'unknown error' }
  }
}
```

**Why:** Pisahkan concern — fungsi ini **hanya** handle 1 HTTP request ke Gemini, return structured result. Bisa di-reuse di loop retry.

---

### 7. `generateWithFallback(requestBody)` — **Baru (Core Resilience Logic)**

```js
// Coba ulang untuk error sementara (503, 500, 502, 504, timeout) dengan jeda yang bertambah.
// Jika satu model tetap gagal, lanjut ke model cadangan. Seluruh proses dibatasi totalBudgetMs.
async function generateWithFallback(requestBody) {
  const deadline = Date.now() + totalBudgetMs
  let last = { status: 0, providerCode: '' }

  for (const model of getModelCandidates()) {
    for (let attempt = 1; attempt <= maxAttemptsPerModel; attempt += 1) {
      const remaining = deadline - Date.now()
      if (remaining < 1_000) return { ok: false, ...last }

      const outcome = await requestGemini(model, requestBody, Math.min(attemptTimeoutMs, remaining))
      if (outcome.ok) return { ...outcome, model }

      last = outcome
      console.error(
        `Gemini request failed: model ${model}, attempt ${attempt}/${maxAttemptsPerModel}, HTTP ${outcome.status}${outcome.providerCode ? ` (${outcome.providerCode})` : ''}`,
      )

      const canRetry = outcome.status === 0 || retryableStatuses.has(outcome.status)
      if (!canRetry) break
      if (attempt < maxAttemptsPerModel) {
        await sleep(retryBaseDelayMs * 2 ** (attempt - 1) + Math.random() * 300)
      }
    }
  }

  return { ok: false, ...last }
}
```

**Flow:**
```
getModelCandidates() → [primary, fallback1, fallback2, default]
  ├─ model 1: attempt 1 → retryable? → sleep 800ms → attempt 2 → sleep 1600ms → attempt 3
  ├─ model 2: attempt 1 → ...
  └─ model 3: ...
```
- **Exponential backoff**: 800ms → 1600ms → 3200ms (+ jitter 0-300ms)
- **Non-retryable** (400, 401, 403, 404, 429) → break loop model, lanjut ke model berikutnya
- **Total budget 28s** → hard stop kalau sudah dekat limit

---

### 8. Handler POST `/api/companion` — **Major Rewrite**

#### A. Validasi model candidates early
```js
if (getModelCandidates().length === 0) {
  sendJson(response, 500, { error: 'Nama model Gemini tidak valid.' })
  return
}
```

#### B. Cache lookup sebelum call Gemini
```js
const cacheKey = createHash('sha256').update(JSON.stringify({ contextAndQuestion, history })).digest('hex')
const cachedAnswer = getCachedAnswer(cacheKey)
if (cachedAnswer) {
  sendJson(response, 200, { answer: cachedAnswer })
  return
}
```

#### C. Pakai `generateWithFallback` + response yang lebih informatif
```js
const outcome = await generateWithFallback(requestBody)

if (!outcome.ok) {
  if (outcome.status === 429) {
    sendJson(response, 429, {
      error: 'Batas gratis atau kuota Gemini sedang tercapai. Coba lagi nanti.',
      retryable: true,          // <-- BARU: flag untuk FE auto-retry
    })
  } else if (outcome.status === 400 || outcome.status === 403) {
    sendJson(response, 502, {
      error: 'Konfigurasi Gemini ditolak. Pengelola perlu memeriksa API key dan model di server.',
    })
  } else {
    sendJson(response, 502, {
      error: 'Aksa sedang sibuk karena layanan Gemini kelebihan permintaan. Coba lagi dalam beberapa detik.',
      retryable: true,          // <-- BARU
    })
  }
  return
}
```

#### D. Simpan ke cache setelah sukses
```js
setCachedAnswer(cacheKey, answer.trim())
sendJson(response, 200, { answer: answer.trim() })
```

#### E. Catch-all error handler yang konsisten
```js
} catch (error) {
  console.error(`Gemini request failed: ${error instanceof Error ? error.name : 'unknown error'}`)
  sendJson(response, 502, { error: 'Koneksi Aksa ke Gemini terputus. Coba lagi sebentar.', retryable: true })
}
```

---

### 9. `serveFrontend` — **Tidak Berubah** (Hanya dipindah ke bawah)

Logika serving static files dari `dist/` identik. Hanya dipindah setelah helper functions agar urutan definisi lebih rapi.

---

## Environment Variables Baru

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `GEMINI_MODEL` | `gemini-3.5-flash-lite` | Model primary |
| `GEMINI_FALLBACK_MODELS` | *(kosong)* | Comma-separated list model cadangan, misal `gemini-1.5-flash-8b,gemini-3.5-flash` |
| `PORT` / `API_PORT` | `8787` | Port server |
| `HOST` | `0.0.0.0` (prod) / `127.0.0.1` (api-only) | Bind address |

---

## Response API Changes (Breaking untuk FE yang parse error)

### Error 429 / 5xx sekarang include `retryable: true`

```json
// Lama
{ "error": "Batas gratis atau kuota Gemini sedang tercapai. Coba lagi nanti." }

// Baru
{ "error": "Batas gratis atau kuota Gemini sedang tercapai. Coba lagi nanti.", "retryable": true }
```

**FE Action:** Bisa implement auto-retry dengan backoff saat `retryable === true`.

---

## Testing Checklist

- [ ] `npm run build && npm start` → server jalan, serve frontend + API
- [ ] `GET /api/companion/status` → return `{ configured: true, provider: "Gemini", model: "..." }`
- [ ] POST `/api/companion` tanpa `GEMINI_API_KEY` → 503 `AI_NOT_CONFIGURED`
- [ ] POST valid → return answer, request kedua yang sama **bukan** hit Gemini (cache hit)
- [ ] Rate limit: >20 req/menit dari IP sama → 429
- [ ] Simulasi Gemini 503 → fallback ke model berikutnya / retry
- [ ] Simulasi Gemini 429 → response `retryable: true`
- [ ] `x-forwarded-for` header → rate limit pakai IP client, bukan proxy

---

## Catatan untuk Pengembang Berikutnya

1. **Cache in-memory** → hilang saat restart. Untuk multi-instance (scaling horizontal), butuh Redis/shared cache.
2. **Rate limit per IP** → di Railway/Cloud Run butuh `x-forwarded-for` trust proxy config (sudah di-handle `getClientAddress`).
3. **Model fallback** → pastikan model di `GEMINI_FALLBACK_MODELS` benar-benar tersedia di project Google Cloud / API key tersebut.
4. **Total budget 28s** → kalau Vite proxy timeout 30s, aman. Kalau deploy ke platform dengan timeout <28s, perlu turunkan `totalBudgetMs`.
5. **Log** → hanya log error status/code, **tidak** log API key, body request, atau jawaban (privasi).

---

## Link Repo

- **GitHub**: https://github.com/razzironaldi/TEMAN-AKSESv2
- **File**: `server/index.mjs`