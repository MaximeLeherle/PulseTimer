# PulseTimer — Product Specification

> Universal sports timer PWA. Any exercise, any training format, clean and focused.

---

## 1. Overview

**App name:** PulseTimer (short name: "Pulse")  
**Stack:** Vanilla JS ES6 modules, HTML, CSS — no framework, no build step, no runtime dependencies.  
**Storage:** 100% localStorage — no backend, no account, no data sent anywhere.  
**localStorage key:** `pulsetimer-config-v1`  
**Targets:** iPhone Safari (primary, PWA install), Android Chrome, desktop secondary.  
**Deployment:** GitHub Pages — `https://maximeleherle.github.io/PulseTimer`

---

## 2. Exercise Input

Free-text field at the top of the home screen, shared across all modes.

- Placeholder: *"Pompes, squats, burpees…"*
- Displayed on the timer screen during the session
- Saved in localStorage alongside config

---

## 3. Work Mode: Time vs Reps

Each training mode defines work phases as **time-based** or **rep-based**.

| Mode | Time | Reps |
|------|------|------|
| Sprint | ✓ | ✓ |
| Tabata | ✓ only | — |
| Séries | ✓ | ✓ |
| Aléatoire | ✓ | ✓ |
| EMOM | ✓ only | — |
| Pyramide | ✓ | ✓ |

**Time-based:** Phase runs for X seconds. Timer counts down. A rep-entry screen appears at the end of the work phase. Rep input is pre-filled with the target (or with the tap count if the user used the counter).

**Rep-based (cap = 0):** No fixed duration. Screen shows target rep count + tap counter. User taps the circular button to count reps. Phase advances automatically when target is reached, or manually via "Suivant". Elapsed time is shown passively but does not block progression.

---

## 4. Training Modes

### Sprint
Single continuous effort.

| Parameter | Description |
|-----------|-------------|
| Target reps | Displayed during the effort |
| Duration | X seconds (0 = rep-based, not exposed in UI yet) |

End: timer reaches 0 → rep entry screen. *(See Known Issues #1)*

---

### Tabata
Fixed work/rest intervals. Time-based only.

| Parameter | Default |
|-----------|---------|
| Work duration | 20 s |
| Rest duration | 10 s |
| Rounds | 8 |
| Target reps / round | 0 (open) |

Rep entry appears after each work phase. Classic format: 8 × (20s effort / 10s rest) = 4 min.

---

### Séries
N sets with configurable rest between each.

| Parameter | Description |
|-----------|-------------|
| Number of sets | N |
| Reps per set | Target (rep-based if cap = 0) |
| Rest between sets | X seconds |
| Time cap per set | Optional — 0 = unlimited (rep-based) |

---

### Aléatoire
N sets with a randomized target drawn per set.

| Parameter | Description |
|-----------|-------------|
| Min / Max | Range for the random draw |
| Number of sets | N (ignored when Total cap > 0) |
| Rest | X seconds |
| Time cap per set | Optional — 0 = rep-based |
| Total cap | Session auto-ends when exact total is reached (draws adjusted) |
| Cacher le total | Hides the progress bar — user doesn't know how many reps remain |
| Mode SURPRISE | Per-set target is hidden until the rep entry screen |

Draw revealed at the start of each set. In Surprise mode, `?` is shown instead of the target; the real number is revealed on the rep entry screen with comparison feedback (Parfait / +N / −N).

---

### EMOM (Every Minute On the Minute)
Fixed-period blocks. User performs their quota; remaining time in the period is automatic rest. Time-based only.

| Parameter | Default |
|-----------|---------|
| Reps per period | 10 |
| Period duration | 60 s |
| Number of periods | 10 |

**Intended behavior:** The timer counts down the full period continuously. The user performs their reps; whatever time remains after completion is passive rest. A rep entry screen appears at the end of each period. *(See Known Issues #2 — current implementation has a bug here)*

---

### Pyramide
Reps or duration follows a configurable ascending (+ optional descending) ramp.

| Parameter | Description |
|-----------|-------------|
| Start | First value (reps or seconds) |
| Peak | Maximum value |
| Step | Increment per set |
| Aller-retour | If on: ascend then descend (mirror) |
| Rest | Seconds between sets |

Example with start=1, peak=5, step=1, aller-retour=on: 1 · 2 · 3 · 4 · 5 · 4 · 3 · 2 · 1 = 9 sets, 25 reps.

---

## 5. Screens & Navigation

```
Home (exercise field + mode cards + config + options)
  └── [Démarrer]
        └── Timer screen
              ├── Rep entry screen  (after each time-based work phase)
              └── Session summary
```

### Home

- Exercise text field (top)
- Mode card grid (2 columns) — each card shows mode name + one-line description, active card highlighted
- Active mode config panel (inputs + toggles + live summary)
- Global options panel (sound, voice, vibration, wake lock, volume, rep estimation)
- "Démarrer" CTA

### Timer Screen

Full-screen, distraction-free.

**Time-based phase:**
- SVG progress circle (countdown)
- Large centered countdown (JetBrains Mono, ≥ 80px)
- Phase label: SPRINT / EFFORT / SÉRIE / MIN / REPOS (uppercase, letter-spacing)
- Exercise name + set target below the label
- Series tracker (bubbles showing past counts, current target, future targets)
- Total progress bar (hidden in Surprise mode or when total hidden)
- Footer: Pause · Suivant

**Rep-based phase (cap = 0):**
- Large circular tap button showing current count
- Target hint below the count
- Undo button (−1)
- Series tracker
- Footer: Pause · Suivant

### Rep Entry Screen

Appears automatically at the end of each time-based work phase.

- Phase label ("Série X/Y terminée")
- Target reveal (in Surprise mode: shows the hidden target with comparison)
- Large numeric input (pre-filled with target or tap count)
- Quick adjustment buttons: −1 / +1 / +5 / +10 / Reset to 0
- "Passer le repos" button (hidden on last set)
- "Valider" CTA (or Enter key)

### Session Summary

- "BRAVO" heading, subtitle "Séance terminée"
- Stats: Total reps · Sets · Duration · Best set
- Per-set breakdown table: set number / target / actual / delta (✓ / +N / −N)
- Actions: "Refaire" · "Terminer"

---

## 6. Settings

| Setting | Default | Notes |
|---------|---------|-------|
| Compte à rebours (3-2-1) | On | |
| Sons | On | |
| Bip dernières 3 secondes | On | |
| Annonces vocales | Off | SpeechSynthesis API |
| Vibration | On | Mobile only |
| Garder l'écran allumé | On | Wake Lock API |
| Volume | 60% | 0–100 |
| Estimation durée / rep | 2 s | Used for live summary calculations |

---

## 7. Audio

- Synthetic beeps via Web Audio API (no external files, no network)
- `tick`: short blip on last 3 seconds of each phase
- `go`: long beep on work phase start
- `rest`: lower beep on rest phase start
- `countdown`: blip per countdown step
- `done`: ascending triple beep on session end
- `click`: tap counter feedback
- Optional voice (SpeechSynthesis, fr-FR): "Trois, deux, un, partez", "Repos", "Bravo, séance terminée"
- Volume slider 0–100%
- Vibration on phase transitions (Vibration API, mobile only)

---

## 8. Design System

### Direction: Minimal — Monochrome Premium
Strong typographic hierarchy, maximum whitespace, restricted palette. No neon, no gradients. References: Whoop, Linear, Raycast.

### Typography

| Role | Font |
|------|------|
| Timer digits, numbers | JetBrains Mono Bold |
| UI, labels, headings | Inter |

*Current implementation uses Google Fonts CDN. Target: self-hosted .woff2 (Step 4).*

### Color Palette

**Dark (default)**
```
--bg:           #0a0a0a
--panel:        #141414
--panel-2:      #1c1c1c
--line:         #252525
--text:         #f0f0f0
--muted:        #555555
--accent:       #ffffff
--accent-soft:  rgba(255,255,255,0.06)
--accent-2:     #aaaaaa
--warn:         #d94f3a
--rest:         #888888
--ok:           #5cb87a
--over:         #c88840
```

**Light**
```
--bg:           #fafafa
--panel:        #ffffff
--panel-2:      #f2f2f2
--line:         #e8e8e8
--text:         #0a0a0a
--muted:        #888888
--accent:       #0a0a0a
--accent-soft:  rgba(0,0,0,0.05)
--accent-2:     #444444
--warn:         #c84020
--rest:         #555555
--ok:           #2a7a50
--over:         #9a6820
```

### Layout

- Max-width: 720px, centered on desktop
- Body padding: 20px mobile
- Card border-radius: 12px
- CTA height: 56px (min touch target: 44×44px)
- Transitions: 150–200ms (state changes)

### Timer

- Countdown font: ≥ 80px, JetBrains Mono 800
- SVG circle: 6px stroke, smooth `stroke-dashoffset` at 0.1s linear
- Phase label: 22px, letter-spacing 3px, uppercase
- Warn state (last 3s): pulse animation + warn color

### Key Components

- **Toggle:** animated pill (no native checkbox), 44×24px
- **Number input:** `--bg` background, 48px height, 16px font (prevents iOS zoom)
- **Mode cards:** 2-col grid, name + description, active = `--accent-soft` bg + `--accent` border
- **Series bubbles:** 32px, colored by status (done/current/future/over/under)
- **Toast:** 2.4s, bottom of screen, slides up
- **Quick buttons:** min 44×44px, grid layout

---

## 9. File Architecture (Target — post Step 1 refactor)

```
/
├── index.html              Shell + <script type="module" src="scripts/app.js">
├── manifest.json
├── README.md
├── SPEC.md
├── CHANGELOG.md
├── LICENSE
├── .gitignore
├── assets/
│   ├── icons/
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   ├── apple-touch-icon.png
│   │   └── favicon.svg
│   └── fonts/
│       ├── JetBrainsMono-Bold.woff2
│       ├── JetBrainsMono-Regular.woff2
│       └── Inter-Variable.woff2
├── styles/
│   ├── base.css            Variables, themes, reset, @font-face
│   ├── components.css      Buttons, inputs, toggles, cards, toasts
│   └── layout.css          Screen layouts, animations
└── scripts/
    ├── app.js              Entry point, screen routing
    ├── state.js            Global state object + DEFAULT_OPTIONS + DEFAULT_CONFIG
    ├── storage.js          localStorage helpers (saveSettings, loadSettings)
    ├── audio.js            Beeps (Web Audio API) + SpeechSynthesis + Vibration
    ├── timer.js            requestAnimationFrame tick loop, phase management
    ├── modes.js            buildRoundTargets() — sequence generation per mode
    ├── ui-home.js          Home screen (mode cards, config panels, summaries)
    ├── ui-timer.js         Timer screen (circle, tap counter, series tracker)
    ├── ui-input.js         Rep entry screen
    ├── ui-done.js          Session summary screen
    └── utils.js            formatTime, fmtDuration, showToast
```

*Current state: single `index.html` monolith (~1500 lines). Refactor to modules is Step 1.*

---

## 10. PWA

**manifest.json**
```json
{
  "name": "PulseTimer",
  "short_name": "Pulse",
  "description": "Universal sports timer — intervals, sets, EMOM, Tabata and more",
  "start_url": "./",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#0a0a0a",
  "theme_color": "#0a0a0a",
  "icons": [
    { "src": "assets/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "assets/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "assets/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

Service Worker (offline cache): deferred to V2.

---

## 11. Accessibility

- `aria-label` on all icon-only buttons
- `<label>` linked to every `<input>`
- WCAG AA contrast on both themes
- Touch targets ≥ 44×44px everywhere
- Keyboard: Tab, Enter (confirm/validate), Space (pause)
- iOS input font-size ≥ 16px to prevent auto-zoom

---

## 12. Known Issues & Improvements

Tracked here for the next dev iteration. Items marked **[bug]** affect current behavior; **[ux]** are UX improvements; **[missing]** are spec-defined features not yet implemented.

### Bugs

~~**[bug] #1 — Sprint: no rep entry after timer ends**~~  
~~`finishSession()` is called directly after the sprint timer.~~  
✅ Fixed — `onPhaseEnd()` calls `showInputScreen()` for all work phases including Sprint.

~~**[bug] #2 — EMOM: no passive rest display**~~  
~~`startRestPhase()` skips directly to the next work phase when `duration = 0`.~~  
✅ Fixed — EMOM work phase duration = `emom.period`; tick loop counts down the full period, then shows the rep entry screen. No explicit rest phase.

### UX Improvements

**[ux] #3 — No "Done" button for free rep phases**  
In rep-based phases (cap = 0), the only way to end a set is to either hit the tap-counter target (auto-advance) or press "Suivant" in the footer. There is no explicit large "TERMINÉ" / "Série faite" button. Adding one as a primary CTA above the footer would be much clearer.

**[ux] #4 — No "Skip rest" from the active timer screen**  
The "Passer le repos" button only appears on the rep entry screen. During a live rest countdown, there is no way to skip it. A "Passer" button in the footer (or the "Suivant" button repurposed) during rest phases would solve this.

**[ux] #5 — Series tracker overflows on many rounds**  
At 10+ sets (pyramid 1→10 = 19 bubbles, random 20 sets), the bubble row wraps and becomes unreadable. Fix: above 8 rounds, replace the bubble row with a compact text indicator `4 / 19` and show a mini linear progress bar instead.

**[ux] #6 — Tap counter lacks visual feedback**  
A tap on `#tap-btn` only increments the number. On mobile without vibration enabled, the user has no strong confirmation. Fix: add a brief scale-pulse CSS animation on each tap (`.tap-btn:active` → `transform: scale(0.92)` already exists but needs a post-release spring animation).

**[ux] #7 — Config panels are long on 320px screens**  
The Random mode config has 6 inputs + 2 toggles before the summary. On small phones this requires scrolling past the options to reach "Démarrer". The two toggle options (SURPRISE, CACHER TOTAL) could be collapsed into a secondary "Options avancées" disclosure section.

**[ux] #8 — "✕ FERMER" is too easy to tap accidentally**  
The close button sits in the top-right corner of the timer screen, a common accidental tap zone. It should trigger a confirmation dialog, or be replaced with a "Stop" button in the footer that requires a deliberate press.

### Missing Features

**[missing] #9 — Self-hosted fonts**  
Currently loading Inter + JetBrains Mono from Google Fonts CDN. Requires network on first load and prevents true offline PWA. Target: `assets/fonts/` with `@font-face` declarations in `base.css`.

**[missing] #10 — PWA manifest + icons**  
`manifest.json` and app icons do not exist yet. The app cannot be installed as a PWA. Required for Step 4.

**[missing] #11 — Sprint rep-based mode not exposed in UI**  
The logic supports `duration = 0` for Sprint (tap counter, no timer) but the UI always requires a duration. A toggle "Durée fixe / Reps libres" would unlock this.

---

## 13. Roadmap

### V1 — Current Sprint

- [x] Monolith app running: 6 modes, tap counter, surprise mode, total cap, dark/light theme
- [x] Generic exercise field (free text, persisted)
- [x] Mode cards (2-col grid, name + description)
- [x] Session summary with per-set breakdown table
- [x] **Step 1:** Refactor monolith → ES6 modules (`scripts/` + `styles/`)
- [x] **Step 2:** Fix known bugs (#1 Sprint rep entry, #2 EMOM logic)
- [ ] **Step 3:** UX improvements (#3 Done button, #4 Skip rest in timer, #5 tracker overflow)
- [ ] **Step 4:** PWA — `manifest.json` + icons + self-hosted fonts (#9, #10)
- [ ] **Step 5:** Accessibility audit + keyboard shortcuts
- [ ] **Step 6:** CHANGELOG, LICENSE

### V2

- Session history: log, stats, 30-day bar chart, export/import JSON
- Daily dashboard: rep counter, goal, streak
- Presets: save/load named configs per mode

### V3+

- AMRAP mode (As Many Reps As Possible in X minutes)
- Circuit mode (multiple exercises per session, ordered or random)
- Shareable config links (URL params)
- 365-day heatmap
- Daily reminder (Notification API)
- i18n (EN / FR)
- Service Worker + offline cache

---

## 14. Conventions

- Conventional commits, English only: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- Mobile-first — test at 320px viewport width
- Touch targets ≥ 44×44px on all interactive elements
- No `console.log` in production code
- No external runtime dependencies (self-hosted fonts are fine)
- `font-size ≥ 16px` on all `<input>` elements (prevents iOS Safari auto-zoom)
- Validate and test each step before starting the next
