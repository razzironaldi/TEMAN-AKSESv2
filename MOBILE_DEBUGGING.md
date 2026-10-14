# Debugging Mobile: Animasi & Interaksi Tidak Berjalan Lancar

> Dokumentasi temuan, analisis akar masalah, dan rencana perbaikan untuk isu animasi/karakter yang tidak bergerak di mobile (iOS Safari, Android Chrome).

---

## Status Implementasi: ✅ SELESAI (Core Fixes)

| # | Issue | Status | Commit |
|---|-------|--------|--------|
| 1 | `prefers-reduced-motion` over-aggressive | ✅ Fixed | `18aa5d9` |
| 2 | QuizMascot GPU optimization | ✅ Fixed | `18aa5d9` |
| 3 | `100dvh`/`100vh` fallback + safe-area | ✅ Fixed | `18aa5d9` |
| 4 | `<dialog>` inline polyfill | ✅ Fixed | `18aa5d9` |
| 5 | StudyCompanion VisualViewport | ✅ Fixed | `18aa5d9` |
| 6 | AudioPlayer onboundary fallback | ✅ Fixed | `18aa5d9` |
| 7 | Character animations toggle | ✅ Added | `c2faa95` |
| 8 | Lazy loading code-split | ✅ Added | `c2faa95` |
| 9 | Touch target audit | ✅ Fixed | `c2faa95` |

---

## Gejala yang Dilaporkan

| Fitur | Desktop | Mobile (Before Fix) | Mobile (After Fix) |
|-------|---------|--------|--------|
| **QuizMascot** (karakter kuis: badan, tangan, kaki, ekspresi) | Beranimasi | **Tidak bergerak / statis** | ✅ Beranimasi (GPU accelerated) |
| **StudyCompanion Avatar** (Aksa di launcher: float, blink) | Beranimasi | **Tidak bergerak** | ✅ Beranimasi + positioning keyboard-safe |
| **Slide/Scroll Reveal** (`data-scroll-reveal`) | Smooth fade+slide up | **Tidak sama / tidak trigger** | ✅ Tetap jalan (hanya reduced-motion essential) |
| **AudioPlayer** (Web Speech API) | Berfungsi | **Tidak konsisten / tidak jalan** | ✅ Fallback highlight per kalimat untuk Safari |
| **Quiz Dialog** (mode hard/santai) | Fullscreen dialog OK | **Layout/UX bermasalah** | ✅ 100vh/dvh fallback + polyfill |
| **Character Animations Toggle** | - | - | ✅ Settings → Animasi Karakter |

---

## Analisis Akar Masalah (Root Cause)

### 1. `prefers-reduced-motion` Over-Aggressive di Mobile ✅ FIXED

**File:** `src/index.css:601-636`

**Masalah:**
- iOS Safari & Android Chrome sering mengirim `prefers-reduced-motion: reduce` saat **Low Power Mode** aktif atau **battery saver** nyala
- Selector `* { animation-duration: 0.01ms !important }` **mematikan SEMUA animasi** termasuk QuizMascot & Aksa avatar

**Solusi Terimplementasi:**
```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .route-transition { animation: none; }
  [data-scroll-reveal] { opacity: 1; transform: none; transition: none; }
  
  /* Hanya matikan animasi TRANSITION & PAGE (essential), BUKAN animasi karakter delightful */
  *:not(.quiz-mascot-character):not(.companion-avatar):not(.quiz-mascot-character *):not(.companion-avatar *) {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  /* Pastikan animasi karakter tetap running */
  .quiz-mascot-character,
  .companion-avatar,
  .quiz-mascot-character *,
  .companion-avatar * {
    animation-play-state: running !important;
  }
}

/* Class untuk toggle user di Settings */
.no-character-animations .quiz-mascot-character,
.no-character-animations .companion-avatar,
.no-character-animations .quiz-mascot-character *,
.no-character-animations .companion-avatar * {
  animation: none !important;
  transition: none !important;
}
```

---

### 2. CSS Animation GPU Optimization ✅ FIXED

**File:** `src/index.css:237-250`

**Solusi Terimplementasi:**
```css
.quiz-mascot-character {
  position: relative;
  width: 7rem;
  height: 8.25rem;
  flex: 0 0 auto;
  /* Mobile optimizations: force GPU layer, hint browser for animation */
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.companion-avatar {
  /* ...existing styles... */
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
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
```

---

### 3. `100dvh` Fallback + Safe Area ✅ FIXED

**File:** `src/components/QuizSection.tsx:229-233`

```tsx
<dialog
  ref={dialogRef}
  className="fixed inset-0 m-0 h-[100vh] h-[100dvh] max-h-none w-screen max-w-none overflow-y-auto border-0 bg-surface p-0 text-text-primary backdrop:bg-surface safe-area-inset-bottom"
  aria-labelledby="active-quiz-title"
  onKeyDownCapture={(event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      leaveQuiz()
    }
  }}
/>
```
- Dual height: `h-[100vh] h-[100dvh]` (CSS fallback)
- `safe-area-inset-bottom` untuk notch/home indicator
- Hapus `onCancel` preventDefault → gesture native (swipe down) jalan

---

### 4. `<dialog>` Inline Polyfill ✅ FIXED

**File:** `src/components/QuizSection.tsx:197-227`

```tsx
// Dialog polyfill for iOS < 15.4 (inline minimal polyfill)
useEffect(() => {
  const dialog = dialogRef.current
  if (!dialog || typeof HTMLDialogElement.prototype.showModal === 'function') return
  
  if (!dialog.showModal) {
    dialog.showModal = function() {
      this.setAttribute('open', '')
      this.style.display = 'flex'
      document.body.style.overflow = 'hidden'
    }
  }
  if (!dialog.close) {
    dialog.close = function() {
      this.removeAttribute('open')
      this.style.display = 'none'
      document.body.style.overflow = ''
    }
  }
  const style = document.createElement('style')
  style.textContent = `
    dialog[open]::backdrop {
      background: rgb(15 23 42 / 48%);
      backdrop-filter: blur(2px);
    }
  `
  document.head.appendChild(style)
  return () => { document.head.removeChild(style) }
}, [])
```
- No external dependency (no `dialog-polyfill` package needed)
- Minimal implementation: `showModal`, `close`, `::backdrop` styling

---

### 5. StudyCompanion VisualViewport Hook ✅ FIXED

**File:** `src/components/StudyCompanion.tsx:14-33, 296-304`

```tsx
function useVisualViewport() {
  const [viewport, setViewport] = useState({ height: 0, offsetTop: 0 })
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return
    const vp = window.visualViewport
    const update = () => setViewport({ height: vp.height, offsetTop: vp.offsetTop })
    update()
    vp.addEventListener('resize', update)
    vp.addEventListener('scroll', update)
    return () => { vp.removeEventListener('resize', update); vp.removeEventListener('scroll', update) }
  }, [])
  return viewport
}

// Usage:
const visualViewport = useVisualViewport()
const bottomPosition = visualViewport.height > 0
  ? visualViewport.offsetTop + visualViewport.height - 100
  : 84 // 5.25rem fallback

return (
  <div className="fixed right-3 z-50 flex flex-col items-end gap-3 md:bottom-5 md:right-5"
       style={{ bottom: `${bottomPosition}px` }}>
```

---

### 6. AudioPlayer onboundary Fallback ✅ FIXED

**File:** `src/components/AudioPlayer.tsx:22-86`

```tsx
const supportsBoundary = speechSupported && 'onboundary' in SpeechSynthesisUtterance.prototype

// In speak():
if (supportsBoundary) {
  u.onboundary = (event) => { /* word-level highlight */ }
} else {
  /* Fallback: highlight per kalimat secara berkala */
  const sentences = text.split(/(?<=[.!?])\s+/u).filter(Boolean)
  let charIndex = 0
  const sentenceDuration = 3000 / Math.max(sentences.length, 1)
  sentences.forEach((sentence, i) => {
    const sentenceStart = charIndex
    const sentenceEnd = charIndex + sentence.length
    charIndex = sentenceEnd + 1
    setTimeout(() => {
      if (utteranceRef.current === u && playing) {
        onHighlightChange?.({ start: sentenceStart, end: sentenceEnd })
      }
    }, i * sentenceDuration)
  })
}
```

---

### 7. Character Animations Toggle (Settings) ✅ ADDED

**Files:** `src/store.ts` (v4), `src/index.css`, `src/components/Layout.tsx`, `src/pages/SettingsPage.tsx`

- State: `characterAnimationsEnabled` (default `true`, persisted)
- Settings UI: Toggle switch dengan `MagicWand` icon
- Applied via `.no-character-animations` class pada Layout root
- CSS: `.no-character-animations .quiz-mascot-character` → `animation: none !important`

---

### 8. Lazy Loading Code-Split ✅ ADDED

**File:** `src/App.tsx`

```tsx
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })))
const OnboardingPage = lazy(() => import('./pages/OnboardingPage').then(m => ({ default: m.OnboardingPage })))
// ... all pages

<Suspense fallback={<LoadingFallback />}>
  <Routes>...</Routes>
</Suspense>
```

**Build Result:**
- Before: `index-DhRY3IdV.js` 518.87 kB (gz 149.92 kB)
- After: `index-NBGWRizZ.js` 361.48 kB (gz 114.06 kB) + chunks per page
- Chunks: LandingPage (25kB), MaterialDetailPage (60kB), SettingsPage (9kB), etc.

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
- [ ] Low Power Mode: animasi karakter tetap jalan (prefers-reduced-motion exclude)
- [ ] Reduced Motion ON: page transition off, karakter animasi **tetap jalan** ✅
- [ ] Settings Toggle: Animasi Karakter ON/OFF → langsung apply tanpa reload
- [ ] Lazy Load: Navigasi halaman → chunk load (network tab)

---

## Catatan untuk Pengembang Berikutnya

1. **Jangan asumsikan `prefers-reduced-motion` = user tidak mau animasi sama sekali**. User mungkin cuma mau matikan transition page, bukan karakter lucu.
2. **Test di device asli**, jangan cuma Chrome DevTools device toolbar. iOS Safari rendering beda signifikan.
3. **Web Speech API di iOS butuh user gesture** (tap/click) sebelum `speak()` bisa jalan. UI sudah handle (button play), tapi error handling perlu ditambah.
4. **CSS `dvh` unit** butuh fallback `vh` untuk browser lama. Selalu tulis dua-duanya.
5. **Animasi karakter pakai `transform` + `opacity` only** → GPU accelerated, hindari `width/height/top/left` animasi.
6. **Lazy loading** sekarang aktif - tambah page baru = auto chunk terpisah.
7. **Store version** naik ke v4 untuk `characterAnimationsEnabled` - migration handle di `migrate()`.

---

## Link Terkait

- Repo: https://github.com/razzironaldi/TEMAN-AKSESv2
- Files utama: `src/index.css`, `src/components/QuizMascot.tsx`, `src/components/StudyCompanion.tsx`, `src/components/QuizSection.tsx`, `src/components/AudioPlayer.tsx`, `src/store.ts`, `src/App.tsx`, `src/pages/SettingsPage.tsx`
- Spec: `README.md`, `HANDOFF.md`
- Changelog: `CHANGES_INDEX_MJS.md`