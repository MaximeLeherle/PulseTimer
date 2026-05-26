# PulseTimer

**A clean, focused sports timer for any exercise.**

PulseTimer is a progressive web app (PWA) designed to handle the timing side of any workout. Name your exercise, pick a training mode, set your parameters, and go. The app manages countdowns, rest periods, audio cues, and rep tracking — nothing else.

**[→ Open PulseTimer](https://maximeleherle.github.io/pulsetimer)**

> Works in any mobile browser. Install it to your home screen for a full native-app experience — no App Store, no Play Store required.

---

## Install on your phone

### iPhone & iPad (Safari)

1. Open **[PulseTimer](https://maximeleherle.github.io/pulsetimer)** in Safari
2. Tap the **Share** icon (bottom center of the screen)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"** to confirm

PulseTimer opens as a standalone app — no browser bar, no distractions, just the timer.

### Android (Chrome)

1. Open **[PulseTimer](https://maximeleherle.github.io/pulsetimer)** in Chrome
2. Tap the **three-dot menu** (top right)
3. Tap **"Add to Home Screen"** or **"Install app"**
4. Tap **"Add"** to confirm

---

## Training modes

| Mode | Description |
|------|-------------|
| **Sprint** | One all-out effort — hit a rep count or outlast a time limit |
| **Tabata** | Classic work/rest intervals (default: 20s on / 10s off × 8) |
| **Sets** | N sets with configurable rest — time-based or rep-based |
| **Random** | Target drawn randomly each set — no preview, no re-roll |
| **EMOM** | Every Minute On the Minute — work resets each block |
| **Pyramid** | Progressive ramp up, down, or both |

Works with any exercise — push-ups, squats, burpees, pull-ups, whatever you're training.

---

## Features

- **Time or rep-based sets** — define work phases by duration or by rep count
- **Free exercise naming** — no predefined list, type anything
- **Presets** — save and reload your favorite configs in one tap
- **Audio feedback** — synthetic beeps (no external files), optional voice cues
- **Haptic feedback** — vibration on phase transitions (mobile)
- **Wake Lock** — screen stays on during your session
- **Dark & light theme** — toggle anytime
- **Keyboard shortcuts** — Space to pause, Enter to confirm (desktop)
- **Offline ready** — works without a connection once loaded

---

## Privacy

Everything stays on your device. PulseTimer uses `localStorage` to save your settings and presets — no server, no account, no tracking, no data sent anywhere.

---

## Stack

- Vanilla JavaScript (ES6 modules)
- HTML + CSS — no framework, no build step, no dependencies
- Web Audio API · SpeechSynthesis API · Vibration API · Wake Lock API
- Hosted on GitHub Pages

---

## Local development

No install needed — just clone and open:

```bash
git clone https://github.com/MaximeLeherle/pulsetimer.git
cd pulsetimer
# Open index.html directly, or use any static server:
npx serve .
```

See [`SPEC.md`](SPEC.md) for the full product specification and architecture.

---

## License

MIT
