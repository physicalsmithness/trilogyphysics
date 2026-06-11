# Batch review: wave_properties (Waves 6.6, batch 1b)

From: 6.6 Waves Authoring. Date: 2026-06-11. Items in `app/topics/waves_6_6.js` (ids `wp_*`), 12 items.

**Covered:** 6.6.1.2.a/b/c/e/g.i. The four quantity definitions (amplitude, wavelength, frequency, period — each with its named-trap distractor); identify/mark amplitude and wavelength on diagrams (both directions: spot-the-error MCQs over the built `wave_train` named-distractor renders `amplitude_double` / `wavelength_half`, AND two `qtype:"widget"` drag-to-mark items per d031/d035); compare two same-scale waves (2024 shape, 45%); energy transfer and wave-speed meaning (6.6.1.2.e); period read off a trace (2020 shape, 25%).

**Qtypes:** mcq_single x10 (two over named-distractor `wave_train` renders), `widget` x2 (`wave_train` with `target:"wavelength"`/`"amplitude"`, 2 marks method+value, errorCodes already registered as slugs). The widget items carry `pending_engine:"widget_qtype"` — authored per the kickoff instruction (many 6.6 items ARE the widget), gradeable as soon as Housing wires the d035 submit flow; nothing else blocks on it.

**Misconceptions exercised:** amplitude_peak_to_trough, wavelength_half_marked, period_frequency_confused, freq_wavelength_inverse_missed, medium_travels_with_wave, plus the widget codes (wavelength_peak_to_trough, amplitude_diagonal, feature orientation) reachable through the two widget items' scorers.

**Flag to Widgets 6.6 (small, non-blocking):** a two-wave same-scale comparison render (the 2024 "waves A and B" shape and the 2020 "which of A–D has the greatest amplitude" shape) is not in the current `wave_train` params (one train per render). The comparison item is authored text-described for now; a `wave_train` variant taking two trains (or a `compare:true` config) would let it and the 2020 trio become picture items. Logged here rather than a thread since it is an enhancement, not a contract change.

**Awkward:** nothing else. Calc items (f=1/T, v=fλ, prefix traps) deliberately held for the wave_calculations batch.
