# PulseTimer — Product Specification

> Universal sports timer PWA. Any exercise, any training format, clean and focused.

---

## 1. Overview

**Stack:** Vanilla JS ES6 modules, HTML, CSS. No framework, no build step, no runtime dependencies.  
**Storage:** 100% localStorage — no backend, no account, no data sent anywhere.  
**Targets:** iPhone Safari (primary, PWA install), Android Chrome, desktop secondary.  
**Deployment:** GitHub Pages — `https://maximeleherle.github.io/pulsetimer`

---

## 2. Exercise Input

Free-text field at the top of every mode config screen.  
- Placeholder: *"Push-ups, Squats, Burpees…"*
- Displayed on the timer screen and saved inside each preset
- No predefined list — fully open

---

## 3. Work Mode: Time vs Reps

Each training mode defines its work phases as **Time-based** or **Rep-based**. Some modes support both; others are fixed.

| Mode | Time | Reps |
|------|------|------|
| Sprint | ✓ | ✓ |
| Tabata | ✓ only | — |
| Sets | ✓ | ✓ |
| Random | ✓ | ✓ |
| EMOM | ✓ only | — |
| Pyramid | ✓ | ✓ |

**Time-based:** Phase runs for X seconds. Timer counts down. User enters reps completed at the end of each work phase (pre-filled with the target, skippable if target is open).

**Rep-based:** No fixed duration. Screen shows target rep count. User taps "Done" when finished. Elapsed time is measured passively and displayed but never blocks progression.

---

## 4. Training Modes

### Sprint
Single continuous effort.

| Parameter | Time | Reps |
|-----------|------|------|
| Duration | X seconds | — |
| Target | N reps (displayed) | N reps (required) |
| End | Timer reaches 0 | User taps "Done" |

---

### Tabata
Fixed work/rest intervals. Time-based only.

| Parameter | Default |
|-----------|---------|
| Work duration | 20 s |
| Rest duration | 10 s |
| Rounds | 8 |
| Target reps / round | 0 (open) |

Rep entry appears after each work phase when a target is set.

---

### Sets
N sets with rest between each.

| Parameter | Time | Reps |
|-----------|------|------|
| Number of sets | X | X |
| Set duration | Y seconds | — |
| Reps per set | Target displayed | N reps required |
| Rest between sets | Z seconds | Z seconds |
| Time cap per set | — | Optional (soft, non-blocking) |

---

### Random
N sets with a randomized target drawn per set.

| Parameter | Description |
|-----------|-------------|
| Number of sets | X |
| Min / Max | Range for the random draw |
| Mode | Time or Reps |
| Rest | Y seconds |

Draw revealed immediately before each set — no preview, no re-roll.

---

### EMOM (Every Minute On the Minute)
Fixed-duration blocks repeat on a loop. User performs the exercise; remaining time is automatic rest. Time-based only.

| Parameter | Default |
|-----------|---------|
| Block duration | 60 s |
| Number of blocks | 8 |
| Target reps / block | 10 |

---

### Pyramid
Rep count or duration follows a configurable ramp.

| Parameter | Description |
|-----------|-------------|
| Start | N reps / seconds |
| Peak | M reps / seconds |
| Step | +P per set |
| Return | Yes / No (mirror the descent) |
| Mode | Time or Reps |
| Rest | Y seconds between sets |

---

## 5. Screens & Navigation

```
Home (mode selector)
  └── Mode config
        └── [Start]
              └── Timer screen
                    ├── Rep entry  (after each time-based work phase)
                    └── Session summary
```

### Home — Mode Selector
Grid of mode cards (2 columns desktop, 1 column mobile).

Each card displays:
- Mode icon (inline SVG)
- Mode name + one-line description
- Current config summary (e.g. "20s / 10s × 8")

Exercise name field sits above the grid, shared across all modes.

---

### Mode Config
- Mode parameters (inputs, toggles)
- Live summary: "8 rounds · ~4 min · ~80 reps"
- Presets section (chips, filtered to active mode)
- "Start" button at the bottom

---

### Timer Screen
Full-screen, distraction-free.

**Time-based:**
- SVG progress circle with countdown
- Large centered countdown
- Phase label: WORK / REST / READY
- Exercise + set target
- Set progress indicator
- Footer: Pause · Skip · Stop

**Rep-based:**
- Large target rep count
- Passive elapsed timer (small)
- Exercise name
- Large "Done" button (primary CTA)
- Phase label + set progress
- Footer: Pause · Stop

---

### Rep Entry Screen (time-based modes only)
Appears automatically at the end of each work phase.

- "Set X / Y — How many reps?"
- Numeric input (pre-filled with target)
- Quick buttons: −1 / +1 / +5 / Reset
- "Confirm" button (or Enter key)
- "Skip rest" button if a rest phase follows
- Rest timer running in the background

---

### Session Summary
- Exercise, mode, total reps, total duration
- Per-set breakdown
- Actions: "Repeat" · "Home"

---

## 6. Presets

- One preset = exercise name + mode + all parameters
- Key: `pulsetimer-presets-v1`
- Displayed as chips in mode config, filtered by active mode
- Load on tap — delete via long press or × icon
- User-defined name on save

---

## 7. Settings

| Setting | Default |
|---------|---------|
| Sound | On |
| Beep volume | 70% |
| Voice announcements | Off |
| Countdown before start | 3 s |
| Vibration | On |
| Wake Lock | On |
| Theme | Dark |

---

## 8. Audio

- Synthetic beeps via Web Audio API (no external files)
- Short beep on the last 3 seconds of each phase
- Long beep on GO / phase transition
- Optional voice (SpeechSynthesis): "Three, two, one, go", "Rest", "Done"
- Volume slider 0–100%
- Vibration on phase transitions (Vibration API, mobile only)

---

## 9. Design System

### Direction: Minimal Premium
Generous whitespace, strong typographic hierarchy, restricted palette. References: Whoop, Linear, Raycast.

### Typography
| Role | Font |
|------|------|
| Timer digits, numbers | JetBrains Mono — self-hosted .woff2 |
| UI, headings, labels | Inter Variable — self-hosted .woff2 |

### Color Palette

**Dark (default)**
```
--bg:         #0c0c0c
--surface:    #161616
--surface-2:  #1f1f1f
--border:     #2a2a2a
--text:       #f0f0f0
--muted:      #6b6b6b
--accent:     #e8ff4a    /* yellow-lime */
--accent-dim: rgba(232,255,74,0.12)
--rest:       #4ae8ff    /* cyan */
--warn:       #ff5a3c
--ok:         #4affa0
```

**Light**
```
--bg:         #f7f7f5
--surface:    #ffffff
--surface-2:  #efefec
--border:     #e0e0da
--text:       #111111
--muted:      #888880
--accent:     #3d7a00    /* WCAG AA */
--rest:       #0070a0
--warn:       #c84020
--ok:         #007840
```

### Layout
- Max-width: 640px, centered on desktop
- Padding: 20px mobile / 32px desktop
- Card border-radius: 16px
- CTA height: 56px
- Transitions: 200ms (states) / 350ms (screen changes)

### Timer
- Countdown font: ≥ 80px, JetBrains Mono Bold
- SVG circle: 6–8px stroke, smooth `stroke-dashoffset`
- Phase label: 11–12px, letter-spacing 3px, uppercase

### Components
- Toggle: animated pill (no native checkbox)
- Number input: `--surface-2`, 48px height, monospace
- Preset chips: outlined pills, `--accent` when active
- Toast: 2s, bottom of screen, subtle
- Quick buttons (±1, +5…): min 44×44px

---

## 10. File Architecture

```
/
├── index.html
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
│   ├── base.css          Variables, themes, reset, @font-face
│   ├── components.css    Buttons, inputs, toggles, chips, toasts
│   └── layout.css        Screen layouts, animations
└── scripts/
    ├── app.js            Entry point, screen routing
    ├── state.js          Global state + constants
    ├── storage.js        localStorage helpers
    ├── audio.js          Beeps + SpeechSynthesis + vibration
    ├── timer.js          Tick loop, phase management
    ├── modes.js          Sequence generation per mode
    ├── ui-home.js        Home screen
    ├── ui-config.js      Mode config screen
    ├── ui-timer.js       Timer screen
    ├── ui-input.js       Rep entry screen
    ├── ui-done.js        Session summary screen
    ├── presets.js        Preset CRUD
    └── utils.js          formatTime, toast, escapeHtml
```

---

## 11. PWA

**manifest.json**
```json
{
  "name": "PulseTimer",
  "short_name": "Pulse",
  "description": "Universal sports timer — intervals, sets, EMOM, Tabata and more",
  "start_url": "./",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#0c0c0c",
  "theme_color": "#0c0c0c",
  "icons": [
    { "src": "assets/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "assets/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "assets/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

Service Worker: deferred to V2.

---

## 12. Accessibility

- `aria-label` on all icon-only buttons
- `<label>` linked to every `<input>`
- WCAG AA contrast on both themes
- Touch targets ≥ 44×44px
- Keyboard: Tab, Enter (confirm), Space (pause)

---

## 13. Roadmap

### V1
- [ ] Step 1: Refactor monolith into ES6 modules
- [ ] Step 2: Generic exercise field + Rep mode
- [ ] Step 3: New design system + mode cards
- [ ] Step 4: PWA manifest + self-hosted fonts
- [ ] Step 5: Accessibility + keyboard shortcuts
- [ ] Step 6: README, CHANGELOG, LICENSE

### V2
- Daily dashboard: rep counter, goal, streak
- Session history: log, stats, 30-day chart, export/import

### V3+
- AMRAP mode
- Circuit mode (multiple exercises per session)
- Shareable config links
- 365-day heatmap
- Daily reminder (Notification API)
- i18n (EN / FR)

---

## 14. Conventions

- Conventional commits, English only: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- Mobile first — test at 320px viewport
- No `console.log` in production
- No external runtime dependencies
- Validate each development step before starting the next
