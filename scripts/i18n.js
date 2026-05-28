const LS_LANG = 'pulsetimer-lang';
let currentLang = localStorage.getItem(LS_LANG)
  || (navigator.language.startsWith('fr') ? 'fr' : 'en');

export function getLang() { return currentLang; }

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem(LS_LANG, lang);
}

export function t(key, vars = {}) {
  let str = translations[currentLang]?.[key] ?? translations.fr[key] ?? key;
  for (const [k, v] of Object.entries(vars)) str = str.replace(`{${k}}`, v);
  return str;
}

export function applyTranslations() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
}

const translations = {
  fr: {
    // Header
    'btn.theme': 'Thème',
    'btn.lang':  'EN',

    // Mode cards
    'mode.sprint.name':  'Sprint',
    'mode.sprint.desc':  'Un effort continu, un objectif de reps ou un temps fixe.',
    'mode.tabata.name':  'Tabata',
    'mode.tabata.desc':  'Effort / repos en alternance. Format classique 20s / 10s.',
    'mode.series.name':  'Séries',
    'mode.series.desc':  'N séries avec repos entre chaque. Objectif libre ou fixe.',
    'mode.random.name':  'Aléatoire',
    'mode.random.desc':  'Tirage au sort entre min et max à chaque série. Surprise !',
    'mode.emom.name':    'EMOM',
    'mode.emom.desc':    'Quota à tenir chaque minute. Le reste du temps = repos.',
    'mode.pyramid.name': 'Pyramide',
    'mode.pyramid.desc': 'Reps croissants jusqu\'au sommet, puis redescente.',

    // Config Sprint
    'config.sprint.title':    'Sprint — X reps en Y secondes',
    'config.sprint.target':   'Objectif (nombre de reps)',
    'config.sprint.duration': 'Durée (secondes)',
    'config.sprint.hint':     'Tu fais le maximum de reps dans le temps imparti.',

    // Config Tabata
    'config.tabata.title':  'Tabata — Effort / Repos',
    'config.tabata.work':   'Durée effort (secondes)',
    'config.tabata.rest':   'Durée repos (secondes)',
    'config.tabata.rounds': 'Nombre de séries',
    'config.tabata.target': 'Objectif reps / série (0 = libre)',
    'config.tabata.hint':   'Format classique : 20s effort / 10s repos × 8 = 4 minutes.',

    // Config Séries
    'config.series.title':  'Séries libres',
    'config.series.rounds': 'Nombre de séries',
    'config.series.reps':   'Reps par série (objectif)',
    'config.series.rest':   'Repos entre séries (secondes)',
    'config.series.cap':    'Limite de temps par série (sec, 0 = illimité)',
    'config.series.hint':   'Tu valides ton compte à la fin de chaque série, le repos démarre.',

    // Config Random
    'config.random.title':       'Aléatoire — Tirage entre 2 nombres',
    'config.random.minmax':      'Reps par série (min — max)',
    'config.random.rounds':      'Nombre de séries',
    'config.random.rest':        'Repos entre séries (secondes)',
    'config.random.cap':         'Limite de temps par série (sec, 0 = illimité)',
    'config.random.totalcap':    'Total cible (0 = séries fixes)',
    'config.random.hide_total':  'Cacher le total cible (tu ne sais pas combien il reste)',
    'config.random.surprise':    'Mode SURPRISE — objectif de série caché 🎲',
    'config.random.hint':        'À chaque série, un nombre aléatoire entre min et max est tiré. Surprise !',

    // Config EMOM
    'config.emom.title':  'EMOM — Every Minute On the Minute',
    'config.emom.reps':   'Reps par minute',
    'config.emom.period': 'Durée d\'une "minute" (secondes)',
    'config.emom.rounds': 'Nombre de minutes (rounds)',
    'config.emom.hint':   'À chaque début de période, tu fais ton quota. Le repos = ce qui te reste sur la période.',

    // Config Pyramide
    'config.pyramid.title':  'Pyramide',
    'config.pyramid.start':  'Départ',
    'config.pyramid.peak':   'Sommet (max)',
    'config.pyramid.step':   'Pas (incrément)',
    'config.pyramid.updown': 'Aller-retour (montée + descente)',
    'config.pyramid.rest':   'Repos entre paliers (secondes)',
    'config.pyramid.hint':   'Ex: 1, 2, 3, 4, 5, 4, 3, 2, 1 (aller-retour) ou 1, 2, 3, 4, 5 (montée seule).',

    // Options
    'options.title':        'Options',
    'options.countdown':    'Compte à rebours avant le départ (3-2-1)',
    'options.sound':        'Sons',
    'options.last_seconds': 'Bip sur les 3 dernières secondes',
    'options.voice':        'Annonces vocales',
    'options.vibrate':      'Vibration',
    'options.wake_lock':    'Garder l\'écran allumé',
    'options.volume':       'Volume (%)',
    'options.rep_estim':    'Estimation durée par rep (sec)',

    // Buttons
    'btn.start':      'Démarrer',
    'btn.close':      '✕ FERMER',
    'btn.pause':      '⏸ PAUSE',
    'btn.resume':     '▶ REPRENDRE',
    'btn.next':       '⏭ SUIVANT',
    'btn.skip':       '⏭ PASSER',
    'btn.done_phase': '✓ SÉRIE FAITE',
    'btn.skip_rest':  '⏭ PASSER LE REPOS',
    'btn.validate':   '✓ VALIDER',
    'btn.restart':    '🔄 REFAIRE',
    'btn.finish':     '✓ TERMINER',

    // Exercise placeholder
    'exercise.placeholder': 'Exercice : pompes, squats, burpees…',

    // Timer
    'timer.total':   'TOTAL',
    'phase.ready':   'PRÊT...',
    'phase.sprint':  'SPRINT',
    'phase.effort':  'EFFORT',
    'phase.series':  'SÉRIE',
    'phase.min':     'MIN',
    'phase.rest':    'REPOS',
    'phase.free':    'LIBRE',

    // Input screen
    'input.phase.sprint':  'SPRINT TERMINÉ',
    'input.phase.series':  'SÉRIE {round}/{total} TERMINÉE',
    'input.question':      'COMBIEN DE REPS ?',
    'input.objective':     'Objectif : {n}',
    'input.free':          'Libre',
    'input.surprise_reveal': '🎲 Objectif secret révélé :',

    // Done screen
    'done.phase':       'TERMINÉ ✓',
    'done.bravo':       'BRAVO',
    'done.subtitle':    'Séance terminée',
    'done.total_reps':  'REPS TOTALES',
    'done.sets':        'SÉRIES',
    'done.duration':    'DURÉE',
    'done.best':        'MEILLEURE SÉRIE',
    'done.col.set':     'Série',
    'done.col.target':  'Cible',
    'done.col.done':    'Réalisé',

    // Compact tracker
    'tracker.series': 'SÉRIE',

    // Summary labels
    'summary.target':        'OBJECTIF',
    'summary.time':          'TEMPS',
    'summary.pace':          'RYTHME',
    'summary.total':         'TOTAL',
    'summary.total_approx':  'TOTAL ≈',
    'summary.total_target':  'TOTAL CIBLE',
    'summary.sets':          'SÉRIES',
    'summary.sets_approx':   'SÉRIES ≈',
    'summary.duration':      'DURÉE',
    'summary.duration_approx': 'DURÉE ≈',
    'summary.effort':        'EFFORT',
    'summary.rest':          'REPOS',
    'summary.range':         'FOURCHETTE',
    'summary.per_min':       'PAR MIN',
    'summary.levels':        'PALIERS',

    // Units
    'unit.reps':    ' p.',
    'unit.times':   ' x',
    'unit.per_sec': '/s',

    // Toast
    'toast.perfect': '🎯 PARFAIT ! Exactement {n} !',
    'toast.over':    '✓ Objectif atteint ! +{n} de plus',
    'toast.under':   'Objectif : {target} — il manquait {n}',

    // Speech
    'speech.three': 'Trois',
    'speech.two':   'Deux',
    'speech.one':   'Un',
    'speech.go':    'Partez',
    'speech.rest':  'Repos',
    'speech.n_reps': '{n} reps',
    'speech.done':  'Bravo, séance terminée',
    'speech.lang':  'fr-FR',
  },

  en: {
    // Header
    'btn.theme': 'Theme',
    'btn.lang':  'FR',

    // Mode cards
    'mode.sprint.name':  'Sprint',
    'mode.sprint.desc':  'One continuous effort — rep target or fixed time.',
    'mode.tabata.name':  'Tabata',
    'mode.tabata.desc':  'Work / rest intervals. Classic 20s / 10s format.',
    'mode.series.name':  'Sets',
    'mode.series.desc':  'N sets with rest in between. Open or fixed target.',
    'mode.random.name':  'Random',
    'mode.random.desc':  'Random draw between min and max each set. Surprise!',
    'mode.emom.name':    'EMOM',
    'mode.emom.desc':    'Hit your quota every minute. Remaining time = rest.',
    'mode.pyramid.name': 'Pyramid',
    'mode.pyramid.desc': 'Reps climb to a peak, then back down.',

    // Config Sprint
    'config.sprint.title':    'Sprint — X reps in Y seconds',
    'config.sprint.target':   'Target (number of reps)',
    'config.sprint.duration': 'Duration (seconds)',
    'config.sprint.hint':     'Do as many reps as you can within the time.',

    // Config Tabata
    'config.tabata.title':  'Tabata — Work / Rest',
    'config.tabata.work':   'Work duration (seconds)',
    'config.tabata.rest':   'Rest duration (seconds)',
    'config.tabata.rounds': 'Number of rounds',
    'config.tabata.target': 'Target reps / round (0 = open)',
    'config.tabata.hint':   'Classic format: 20s work / 10s rest × 8 = 4 minutes.',

    // Config Sets
    'config.series.title':  'Sets',
    'config.series.rounds': 'Number of sets',
    'config.series.reps':   'Reps per set (target)',
    'config.series.rest':   'Rest between sets (seconds)',
    'config.series.cap':    'Time cap per set (sec, 0 = unlimited)',
    'config.series.hint':   'Log your count at the end of each set, then rest starts.',

    // Config Random
    'config.random.title':       'Random — Draw between 2 numbers',
    'config.random.minmax':      'Reps per set (min — max)',
    'config.random.rounds':      'Number of sets',
    'config.random.rest':        'Rest between sets (seconds)',
    'config.random.cap':         'Time cap per set (sec, 0 = unlimited)',
    'config.random.totalcap':    'Total target (0 = fixed sets)',
    'config.random.hide_total':  "Hide total target (you don't know how many are left)",
    'config.random.surprise':    'SURPRISE mode — set target hidden 🎲',
    'config.random.hint':        'Each set, a random number between min and max is drawn. Surprise!',

    // Config EMOM
    'config.emom.title':  'EMOM — Every Minute On the Minute',
    'config.emom.reps':   'Reps per minute',
    'config.emom.period': 'Period duration (seconds)',
    'config.emom.rounds': 'Number of minutes (rounds)',
    'config.emom.hint':   'At each period start, do your quota. Remaining time = rest.',

    // Config Pyramid
    'config.pyramid.title':  'Pyramid',
    'config.pyramid.start':  'Start',
    'config.pyramid.peak':   'Peak (max)',
    'config.pyramid.step':   'Step (increment)',
    'config.pyramid.updown': 'Up & down (ascend then descend)',
    'config.pyramid.rest':   'Rest between levels (seconds)',
    'config.pyramid.hint':   'E.g.: 1, 2, 3, 4, 5, 4, 3, 2, 1 (up & down) or 1, 2, 3, 4, 5 (up only).',

    // Options
    'options.title':        'Options',
    'options.countdown':    'Countdown before start (3-2-1)',
    'options.sound':        'Sounds',
    'options.last_seconds': 'Beep on last 3 seconds',
    'options.voice':        'Voice announcements',
    'options.vibrate':      'Vibration',
    'options.wake_lock':    'Keep screen on',
    'options.volume':       'Volume (%)',
    'options.rep_estim':    'Time estimate per rep (sec)',

    // Buttons
    'btn.start':      'Start',
    'btn.close':      '✕ CLOSE',
    'btn.pause':      '⏸ PAUSE',
    'btn.resume':     '▶ RESUME',
    'btn.next':       '⏭ NEXT',
    'btn.skip':       '⏭ SKIP',
    'btn.done_phase': '✓ SET DONE',
    'btn.skip_rest':  '⏭ SKIP REST',
    'btn.validate':   '✓ CONFIRM',
    'btn.restart':    '🔄 REDO',
    'btn.finish':     '✓ DONE',

    // Exercise placeholder
    'exercise.placeholder': 'Exercise: push-ups, squats, burpees…',

    // Timer
    'timer.total':   'TOTAL',
    'phase.ready':   'READY...',
    'phase.sprint':  'SPRINT',
    'phase.effort':  'EFFORT',
    'phase.series':  'SET',
    'phase.min':     'MIN',
    'phase.rest':    'REST',
    'phase.free':    'OPEN',

    // Input screen
    'input.phase.sprint':    'SPRINT DONE',
    'input.phase.series':    'SET {round}/{total} DONE',
    'input.question':        'HOW MANY REPS?',
    'input.objective':       'Target: {n}',
    'input.free':            'Open',
    'input.surprise_reveal': '🎲 Secret target revealed:',

    // Done screen
    'done.phase':      'DONE ✓',
    'done.bravo':      'GREAT JOB',
    'done.subtitle':   'Session complete',
    'done.total_reps': 'TOTAL REPS',
    'done.sets':       'SETS',
    'done.duration':   'DURATION',
    'done.best':       'BEST SET',
    'done.col.set':    'Set',
    'done.col.target': 'Target',
    'done.col.done':   'Done',

    // Compact tracker
    'tracker.series': 'SET',

    // Summary labels
    'summary.target':          'TARGET',
    'summary.time':            'TIME',
    'summary.pace':            'PACE',
    'summary.total':           'TOTAL',
    'summary.total_approx':    'TOTAL ≈',
    'summary.total_target':    'TARGET TOTAL',
    'summary.sets':            'SETS',
    'summary.sets_approx':     'SETS ≈',
    'summary.duration':        'DURATION',
    'summary.duration_approx': 'DURATION ≈',
    'summary.effort':          'EFFORT',
    'summary.rest':            'REST',
    'summary.range':           'RANGE',
    'summary.per_min':         'PER MIN',
    'summary.levels':          'LEVELS',

    // Units
    'unit.reps':    ' r.',
    'unit.times':   ' x',
    'unit.per_sec': '/s',

    // Toast
    'toast.perfect': '🎯 PERFECT! Exactly {n}!',
    'toast.over':    '✓ Target hit! +{n} more',
    'toast.under':   'Target: {target} — missed by {n}',

    // Speech
    'speech.three':  'Three',
    'speech.two':    'Two',
    'speech.one':    'One',
    'speech.go':     'Go',
    'speech.rest':   'Rest',
    'speech.n_reps': '{n} reps',
    'speech.done':   'Well done, session complete',
    'speech.lang':   'en-US',
  },
};
