# Batch review: compass_and_earth (Magnetism 6.7, batch 4)

From: 6.7 Magnetism Authoring chat. Date: 2026-06-11. Status: delivered for review.

Small batch (the subtag is intentionally thin), appended to `app/topics/magnetism_6_7.js` in the engine JSON shape.

## What it covers

- **Spec codes:** 6.7.1.2.e (a compass contains a small bar magnet; the Earth has a magnetic field), 6.7.1.2.f.iii (compass behaviour as evidence the Earth's core is magnetic).
- **Atoms (both in the subtag):** `compass_is_bar_magnet`, `earth_field_evidence`.
- **Items: 5.** 4 `mcq`, 1 `level_of_response_6`. Tier: all `FH`.
- **Misconceptions exercised:** `earth_field_link_missed`, `magnetic_materials_misidentified`, `pole_names_confused` (cross-firing).
- **Salvage:** `compass_needle`, `earth_core` reworked.
- **Sources:** 3 `aqa_ppq` (2022 P2F 4.1, 2023 P2F 3.4, 2023 P2H 4.5), 2 salvaged.

The `level_of_response_6` item encodes the 2023 P2H 4.5 mark scheme exactly (needle always points the same way / north, AND aligns with the Earth's field), with the examiner-flagged thin answer ("it points north" with no field link) as the `earth_field_link_missed` wrong claim.

## NEW_FLAG proposals

None.

## Anything awkward

Nothing. The "compasses point the same way with no current" item (2023 P2F 3.4) sits here rather than in electromagnetism because the creditworthy reason is the Earth's field, not the wire's.

## Validation

Part of the whole-file conformance run (see review/electromagnetism.md): both atoms covered, all slugs resolve, smoke 75/75.
