# Debugging Mobile: Animasi & Interaksi Tidak Berjalan Lancar

> Dokumentasi temuan, analisis akar masalah, dan rencana perbaikan untuk isu animasi/karakter yang tidak bergerak di mobile (iOS Safari, Android Chrome).

---

## Gejala yang Dilaporkan

| Fitur | Desktop | Mobile |
|-------|---------|--------|
| **QuizMascot** (karakter kuis: badan, tangan, kaki, ekspresi) | Beranimasi (breathe, clap, wave, dance) | **Tidak bergerak / statis** |
| **StudyCompanion Avatar** (Aksa di launcher: float, blink) | Beranimasi | **Tidak bergerak** |
| **Slide/Scroll Reveal** (`data-scroll-reveal`) | Smooth fade+slide up | **Tidak sama / tidak trigger** |
| **AudioPlayer** (Web Speech API) | Berfungsi | **Tidak konsisten / tidak jalan** |
| **Quiz Dialog** (mode hard/santai) | Fullscreen dialog OK | **Layout/UX bermasalah** |

---

## Analisis Akar Masalah (Root Cause)

### 1. `prefers-reduced-motion` Over-Aggressive di Mobile

**File:** `src/index.css:582-602`

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .route-transition { animation: none; }
  [data-scroll-reveal] { opacity: 1; transform: none; transition: none; }
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Masalah:**
- iOS Safari & Android Chrome sering mengirim `prefers-reduced-motion: reduce` saat **Low Power Mode** aktif atau **battery saver** nyala
- Selector `* { animation-duration: 0.01ms !important }` **mematikan SEMUA animasi** termasuk QuizMascot & Aksa avatar
- Ini *by design* untuk a11y, tapi terlalu agresif untuk animasi karakter yang *non-essential* tapi *delightful*

**Solusi:** Pisahkan animasi "essential" vs "delightful". Hanya matikan animasi essential (page transition, scroll reveal) saat reduced-motion. Biarkan animasi karakter (idle breathe, blink, float) tetap jalan dengan `animation-play-state: paused` ganti pakai JS, atau exclude class tertentu.

---

### 2. CSS `animation` pada `::before`/`::after` & `transform-origin` di Mobile Safari

**File:** `src/index.css` (QuizMascot keyframes 465-536)

**Masalah:**
- Mobile Safari (iOS < 16) memiliki bug pada `transform-origin` pada pseudo-elements (`::before`, `::after`) yang digunakan di `.quiz-mascot-body::before`, `.quiz-mascot-eye`, dll
- `box-shadow: inset` pada animasi `quiz-body-breathe` kadang tidak render di GPU mobile
- `border-radius` kompleks (`48% 48% 43% 43% / 42% 42% 48% 48%`) + `transform` → rendering artifacts

**Solusi:**
- Gunakan `will-change: transform, opacity` pada `.quiz-mascot-character` container
- Simplify `border-radius` ke value tetap (misal `50%` / `1rem`) untuk mobile
- Pakai `transform: translateZ(0)` untuk force GPU layer

---

### 3. `100dvh` & `100vh` Issues di Mobile Browser Chrome/Safari

**File:** `src/components/QuizSection.tsx:200`, `src/components/StudyCompanion.tsx:276`

```tsx
// QuizSection
className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none..."

// StudyCompanion
className="fixed bottom-[5.25rem] right-3 z-50... md:bottom-5 md:right-5"
```

**Masalah:**
- `100dvh` (dynamic viewport height) support bervariasi: Safari iOS 15.4+, Chrome Android 108+
- Di versi lama: `100dvh` = `100vh` = termasuk address bar → konten terpotong/overflow
- `bottom-[5.25rem]` fixed positioning bermasalah saat virtual keyboard buka (iOS Safari: fixed element ikut naik)

**Solusi:**
- Fallback: `height: 100vh; height: 100dvh;` (dua baris)
- Gunakan `visualViewport` API untuk positioning floating elements
- Atau pakai `position: sticky` + container scroll sebagai alternatif

---

### 4. Web Speech API (`AudioPlayer`) Tidak Konsisten di Mobile

**File:** `src/components/AudioPlayer.tsx`

**Masalah:**
| Platform | Dukungan |
|----------|----------|
| Chrome Android | Full support (tapi butuh user gesture dulu) |
| Safari iOS | **Butuh user gesture**, voice download async, `onboundary` **tidak didukung** |
| Samsung Internet | Partial |
| Firefox Android | Tidak support |

- `onboundary` event (untuk word highlight) **hanya Chrome desktop/Android** → mobile Safari tidak highlight kata
- `speechSynthesis.getVoices()` butuh `voiceschanged` event di iOS
- Low Power Mode → `speechSynthesis.speak()` diblokir/delay

**Solusi:**
- Feature detect `onboundary` support → fallback ke highlight per kalimat/paragraf
- Pre-load voices di `useEffect` mount
- Tampilkan pesan "Audio butuh interaksi pengguna" saat gagal

---

### 5. `<dialog>` Element Behavior di Mobile

**File:** `src/components/QuizSection.tsx:198-211`

```tsx
<dialog
  ref={dialogRef}
  className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none overflow-y-auto border-0 bg-surface p-0..."
  onKeyDownCapture={(event) => { if (event.key === 'Escape') {...} }}
  onCancel={(event) => { event.preventDefault(); leaveQuiz() }}
>
```

**Masalah:**
- iOS Safari < 15.4: `<dialog>` **tidak support** `showModal()` → butuh polyfill
- `onCancel` di mobile: swipe down/gesture back kadang trigger `cancel` event tidak konsisten
- `fixed inset-0` + `overflow-y-auto` pada dialog → scrolling ganda (body + dialog) di iOS

**Solusi:**
- Cek `HTMLDialogElement.prototype.showModal` → load polyfill kalau tidak ada
- `onCancel` hanya untuk Escape, jangan preventDefault gesture native
- Gunakan `dialog::backdrop` styling di CSS (sudah ada di `index.css:568` tapi perlu mobile adjustment)

---

### 6. `data-scroll-reveal` IntersectionObserver Threshold di Mobile

**File:** `src/index.css:87-96`, digunakan di banyak halaman

```css
[data-scroll-reveal] {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 420ms ease-out, transform 420ms ease-out;
}
[data-scroll-reveal].is-revealed { opacity: 1; transform: translateY(0); }
```

**Masalah:**
- `IntersectionObserver` threshold default (0) → trigger saat 1px visible
- Di mobile: scroll cepat / momentum scroll → element lewat viewport sebelum observer fire
- `rootMargin` tidak diset → butuh `rootMargin: '0px 0px -50px 0px'` agar trigger lebih awal

**Solusi:** Perbaiki `IntersectionObserver` config di komponen yang memasang `data-scroll-reveal` (perlu cari di `App.tsx` atau layout).

---

### 7. Touch Target Size & Hit Area

**File:** Various components

**Masalah:**
- Beberapa button/interactive element < 44x44px (minimum WCAG 2.1 AA)
- Quiz option buttons: `min-h-16` (64px) ✓ OK
- Aksa launcher: `min-h-14` (56px) ✓ OK
- Tapi `QuizMascot` gesture area & close button dialog mungkin kecil

---

## Rencana Perbaikan (Prioritas)

### P1 - Critical (Blokir UX Mobile)

| # | Issue | File | Fix |
|---|-------|------|-----|
| 1 | `prefers-reduced-motion` matikan semua animasi karakter | `src/index.css:582-602` | Exclude `.quiz-mascot-character`, `.companion-avatar` dari universal reset |
| 2 | QuizMascot animasi tidak jalan di iOS Safari | `src/index.css:225-536` | Add `will-change`, simplify border-radius, force GPU layer |
| 3 | `100dvh` fallback untuk dialog quiz | `src/components/QuizSection.tsx:200` | Dual height declaration + safe-area-inset |
| 4 | `<dialog>` polyfill untuk iOS < 15.4 | `src/components/QuizSection.tsx` | Dynamic import polyfill |

### P2 - High (Degradasi UX)

| # | Issue | File | Fix |
|---|-------|------|-----|
| 5 | StudyCompanion fixed positioning + virtual keyboard | `src/components/StudyCompanion.tsx:271` | `visualViewport` API listener |
| 6 | AudioPlayer `onboundary` fallback | `src/components/AudioPlayer.tsx:68-75` | Detect support → fallback highlight |
| 7 | Scroll reveal `IntersectionObserver` config | TBD (cari pemasang) | `rootMargin`, `threshold: 0.1` |

### P3 - Polish

| # | Issue | File | Fix |
|---|-------|------|-----|
| 8 | Touch target audit semua interactive | All components | Min 44x44px |
| 9 | Reduced-motion toggle di Settings | `src/pages/SettingsPage.tsx` | User override untuk animasi delightful |
| 10 | Test matrix dokumentasi | `MOBILE_DEBUGGING.md` | Device/browser matrix |

---

## Implementasi Fix: Contoh Kode

### Fix 1: Exclude Animasi Karakter dari Reduced Motion

```css
/* src/index.css - REPLACE lines 582-602 */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .route-transition { animation: none; }
  
  [data-scroll-reveal] {
    opacity: 1;
    transform: none;
    transition: none;
  }
  
  /* Hanya matikan animasi TRANSITION & PAGE, BUKAN animasi karakter delightful */
  *:not(.quiz-mascot-character):not(.companion-avatar):not(.quiz-mascot-character *) {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  /* Karakter tetap bisa di-pause via JS jika user benar2 mau */
  .quiz-mascot-character,
  .companion-avatar {
    animation-play-state: running; /* default jalan */
  }
}
```

**Alternatif (lebih bersih):** Tambah class `.motion-safe` hanya untuk animasi essential, dan `.motion-reduce-ok` untuk animasi karakter.

---

### Fix 2: QuizMascot Mobile-Optimized Animations

```css
/* src/index.css - TAMBAHKAN setelah .quiz-mascot-character */
.quiz-mascot-character {
  will-change: transform, opacity;
  transform: translateZ(0); /* force GPU layer */
}

/* Simplify border-radius untuk mobile */
@media (max-width: 768px) {
  .quiz-mascot-body {
    border-radius: 50% 50% 45% 45% / 45% 45% 50% 50%;
  }
  .quiz-mascot-arm,
  .quiz-mascot-leg span {
    border-radius: 999px;
  }
}

/* Pastikan keyframes pakai transform-only (no layout thrashing) */
@keyframes quiz-body-breathe {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-3px) rotate(1deg); }
}
```

---

### Fix 3: Dialog Height Fallback + Safe Area

```tsx
// src/components/QuizSection.tsx:198-211
<dialog
  ref={dialogRef}
  className="fixed inset-0 m-0 h-[100vh] h-[100dvh] max-h-none w-screen max-w-none overflow-y-auto border-0 bg-surface p-0 text-text-primary backdrop:bg-surface safe-area-inset-bottom"
  style={{
    // Force height untuk browser tanpa dvh support
    height: '100vh',
    height: '100dvh',
  }}
  aria-labelledby="active-quiz-title"
  onKeyDownCapture={(event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      leaveQuiz()
    }
  }}
  // HAPUS onCancel preventDefault untuk gesture native
>
```

---

### Fix 4: Dialog Polyfill (Lazy Load)

```tsx
// src/components/QuizSection.tsx - TAMBAHKAN di top level
useEffect(() => {
  if (typeof HTMLDialogElement.prototype.showModal !== 'function') {
    import('dialog-polyfill').then(({ default: dialogPolyfill }) => {
      dialogPolyfill.registerDialog(dialogRef.current!)
    })
  }
}, [])
```

---

### Fix 5: StudyCompanion VisualViewport Handling

```tsx
// src/components/StudyCompanion.tsx - TAMBAHKAN hook
function useVisualViewport() {
  const [viewport, setViewport] = useState({ height: 0, offsetTop: 0 })
  
  useEffect(() => {
    if (typeof visualViewport === 'undefined') return
    const update = () => setViewport({ 
      height: visualViewport.height, 
      offsetTop: visualViewport.offsetTop 
    })
    update()
    visualViewport.addEventListener('resize', update)
    visualViewport.addEventListener('scroll', update)
    return () => {
      visualViewport.removeEventListener('resize', update)
      visualViewport.removeEventListener('scroll', update)
    }
  }, [])
  return viewport
}

// Di komponen:
const visualViewport = useVisualViewport()
// Gunakan visualViewport.height untuk positioning bottom
```

---

### Fix 6: AudioPlayer onboundary Fallback

```tsx
// src/components/AudioPlayer.tsx - MODIFIKASI speak()
const speak = useCallback(() => {
  // ... existing code ...
  
  // Feature detect onboundary support
  const supportsBoundary = 'onboundary' in SpeechSynthesisUtterance.prototype
  
  u.onboundary = supportsBoundary ? (event) => {
    if (utteranceRef.current !== u || event.name !== 'word') return
    const start = event.charIndex
    const word = text.slice(start).match(/^\S+/u)?.[0]
    const end = start + (event.charLength || word?.length || 1)
    onHighlightChange?.({ start, end })
  } : null
  
  // Fallback: highlight per kalimat jika tidak support boundary
  if (!supportsBoundary) {
    // Split text jadi sentences, highlight sequential
    const sentences = text.split(/(?<=[.!?])\s+/u)
    let charIndex = 0
    sentences.forEach((sentence, i) => {
      setTimeout(() => {
        onHighlightChange?.({ start: charIndex, end: charIndex + sentence.length })
        charIndex += sentence.length + 1
      }, i * 2000 / sentences.length) // rough timing
    })
  }
  // ...
}, [...])
```

---

## Testing Checklist (Manual)

### Device Matrix

| Device | OS | Browser | Test Status |
|--------|-----|---------|-------------|
| iPhone 14/15 | iOS 17+ | Safari | ⬜ |
| iPhone SE | iOS 15/16 | Safari | ⬜ |
| iPad | iPadOS 17 | Safari | ⬜ |
| Samsung Galaxy S23 | Android 14 | Chrome | ⬜ |
| Pixel 7 | Android 14 | Chrome | ⬜ |
| Xiaomi/Redmi | Android 13 | Chrome/MIUI Browser | ⬜ |
| Desktop | Windows/macOS | Chrome/Firefox/Safari | ✅ (baseline) |

### Test Cases

- [ ] QuizMascot: idle breathe, blink, clap (correct), wave (encouragement), dance (perfect)
- [ ] StudyCompanion: avatar float, blink, listening state
- [ ] Scroll reveal: LandingPage, Dashboard, MaterialsList trigger di scroll
- [ ] Quiz Dialog: buka/tutup, scroll content, orientation change
- [ ] AudioPlayer: play/pause/stop, rate change, highlight (Chrome), fallback (Safari)
- [ ] Virtual keyboard: Aksa launcher tidak tergeser, input focus OK
- [ ] Low Power Mode: animasi karakter tetap jalan (user preference)
- [ ] Reduced Motion ON: page transition off, karakter animasi **tetap jalan** (fix target)

---

## Catatan untuk Pengembang Berikutnya

1. **Jangan asumsikan `prefers-reduced-motion` = user tidak mau animasi sama sekali**. User mungkin cuma mau matikan transition page, bukan karakter lucu.
2. **Test di device asli**, jangan cuma Chrome DevTools device toolbar. iOS Safari rendering beda signifikan.
3. **Web Speech API di iOS butuh user gesture** (tap/click) sebelum `speak()` bisa jalan. UI sudah handle (button play), tapi error handling perlu ditambah.
4. **CSS `dvh` unit** butuh fallback `vh` untuk browser lama. Selalu tulis dua-duanya.
5. **Animasi karakter pakai `transform` + `opacity` only** → GPU accelerated, hindari `width/height/top/left` animasi.

---

## Link Terkait

- Repo: https://github.com/razzironaldi/TEMAN-AKSESv2
- Files utama: `src/index.css`, `src/components/QuizMascot.tsx`, `src/components/StudyCompanion.tsx`, `src/components/QuizSection.tsx`, `src/components/AudioPlayer.tsx`
- Spec: `README.md`, `HANDOFF.md`